"use client";

import { ChatItem, ExtendedMessage, Message } from "@/types/chat-types";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./socket-context";
import { getChatMessagesByChatId } from "@/actions/chat-actions";
import { AppUser } from "@/types/user";
import { createChatRecordForMsg } from "@/lib/utils";

type ChatContextType = {
  activeChatId: string | null;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chats: ChatItem[];
  activeChatUser: AppUser | null;
  setActiveChatUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
  setChats: React.Dispatch<React.SetStateAction<ChatItem[]>>;
  updateChats: (msg: Message) => void;
  currentChatMessages: any;
  setCurrentChatMessages: any;
  updateCurrentChat: (msg: ExtendedMessage) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({
  currentUser,
  children,
  initialChats,
}: {
  currentUser: AppUser;
  children: React.ReactNode;
  initialChats: ChatItem[];
}) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<AppUser | null>(null);

  const [chats, setChats] = useState(initialChats);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const { socket, isConnected } = useSocket();
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  const updateChats = useCallback(
    (msg) => {
      setChats((prevChats) => {
        // if the chat is old, update it, if the chat is new, push the new record
        if (msg.isInNewChat) {
          const newChatRecord = createChatRecordForMsg(msg, currentUser, activeChatUser);
          return [newChatRecord, ...prevChats];
        }
        return prevChats.map((chat) => (chat.chatId === msg.chatId ? { ...chat, lastMessage: msg.content } : chat));
      });
    },
    [activeChatUser, currentUser]
  );

  const updateCurrentChat = useCallback(
    (msg: ExtendedMessage) => {
      if (activeChatId === msg.chatId) {
        const newMsg: Message = {
          chatId: msg.chatId,
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          sentAt: msg.sentAt,
        };
        setCurrentChatMessages((prevMsgs) => (prevMsgs ? [...prevMsgs, newMsg] : null));
      }
    },
    [activeChatId]
  );

  // join all chat rooms for logged in user
  useEffect(() => {
    if (socket && isConnected) {
      // chats are updated when a message is sent in new chat and hence even that room is joined by the logged in user
      chats.forEach((chat) => {
        if (!joinedRoomsRef.current.has(chat.chatId)) {
          socket.emit("join-room", chat.chatId);
          joinedRoomsRef.current.add(chat.chatId);
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
      const data = await getChatMessagesByChatId(activeChatId);
      if (data) setCurrentChatMessages(data.messages);
    };
    fetchCurrentChatData();
  }, [activeChatId]);

  // listen for new-chat for the receiver side
  useEffect(() => {
    if (!socket) return;
    const handleNewChat = ({ roomId: chatId, chatData }: { roomId: string; chatData: any }) => {
      // Add chatData to chats
      setChats((prev) => [chatData, ...prev]);

      // make receiver join the room for future messages
      socket.emit("join-room", chatId);
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
      updateChats(msg);
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
