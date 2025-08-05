"use client";

import { Chat, ChatMessagePayload, Message } from "@/types/chat-types";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./socket-context";
import { getChatMessagesByChatId } from "@/actions/chat-actions";
import { AppUser } from "@/types/user";
import { createNewChatRecord } from "@/lib/utils";

type ChatContextType = {
  activeChatId: string | null;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chats: Chat[];
  activeChatUser: AppUser | null;
  setActiveChatUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  updateChats: (data: ChatMessagePayload & { user: AppUser }) => void;
  currentChatMessages: Message[];
  setCurrentChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  updateCurrentChat: (msg: Message) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({
  children,
  initialChats,
}: {
  children: React.ReactNode;
  initialChats: Chat[];
}) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<AppUser | null>(null);

  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const { socket, isConnected } = useSocket();
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  // Updates the chat if its old chat, pushes a new chat record if its new chat
  const updateChats = useCallback(({ message, isNewChat, chat, user }: ChatMessagePayload & { user: AppUser | null }) => {
    setChats((prevChats) => {
      if (!isNewChat) {
        // update the chat
        return prevChats.map((pc) => {
          if (pc.id === message.chatId) {
            return { ...pc, lastMessage: message.content }; // maybe modify lastRead as well
          }
          return pc;
        });
      }
      // push new chat record to the chat list
      const newChatRecord = createNewChatRecord({ message, chat, user });
      if(!newChatRecord) return prevChats;
      return [newChatRecord, ...prevChats];
    });
  }, []);

  const updateCurrentChat = useCallback(
    (message: Message) => {
      if (activeChatId === message.chatId) {
        setCurrentChatMessages((prevMsgs) => (prevMsgs ? [...prevMsgs, message] : []));
      }
    },
    [activeChatId]
  );

  // join all chat rooms for logged in user
  useEffect(() => {
    if (socket && isConnected) {
      // chats are updated when a message is sent in new chat and hence even that room is joined by the logged in user
      chats.forEach((chat) => {
        if (!joinedRoomsRef.current.has(chat.id)) {
          socket.emit("join-room", chat.id);
          joinedRoomsRef.current.add(chat.id);
        }
      });
    }
  }, [chats, isConnected, socket]);

  // fetch current chat messages
  useEffect(() => {
    const fetchCurrentChatData = async () => {
      if (!activeChatId) {
        setCurrentChatMessages([]);
        return;
      }
      const messages = await getChatMessagesByChatId(activeChatId);
      if (messages) setCurrentChatMessages(messages);
    };
    fetchCurrentChatData();
  }, [activeChatId]);

  // listen for new-chat for the receiver side
  useEffect(() => {
    if (!socket) return;
    const handleNewChat = ({ roomId, chatData }: { roomId: string; chatData: Chat }) => {
      // Add chatData to chats
      setChats((prev) => [chatData, ...prev]);

      // make receiver join the room for future messages
      socket.emit("join-room", roomId);
    };
    socket.on("new-chat", handleNewChat);

    return () => {
      socket.off("new-chat", handleNewChat);
    };
  }, [socket]);

  // add receive-message event listener to socket
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg: Message) => {
      updateCurrentChat(msg);
      updateChats({ message: msg, isNewChat: false, chat: undefined, user: null });
    };

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [socket, updateCurrentChat, updateChats]);

  return (
    <ChatContext
      value={{
        activeChatId,
        setActiveChatId,
        activeChatUser,
        setActiveChatUser,
        chats,
        setChats,
        updateChats,
        currentChatMessages,
        setCurrentChatMessages,
        updateCurrentChat,
      }}
    >
      {children}
    </ChatContext>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
