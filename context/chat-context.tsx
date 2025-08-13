"use client";

import { ChatRecord, DataForReceiver, Message } from "@/types/chat-types";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./socket-context";
import { getChatMessagesByChatId } from "@/actions/chat-actions";
import { AppUser } from "@/types/user";
import { createChatRecord } from "@/lib/utils";

type ChatContextType = {
  activeChatId: string | null;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chats: ChatRecord[];
  activeChatUser: AppUser | null;
  joinRoom: (roomId: string) => void;
  setActiveChatUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
  setChats: React.Dispatch<React.SetStateAction<ChatRecord[]>>;
  updateChatList: (chat: ChatRecord) => void;
  currentChatMessages: Message[];
  setCurrentChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  updateCurrentChatMessages: (msg: Message) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children, initialChats }: { children: React.ReactNode; initialChats: ChatRecord[] }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<AppUser | null>(null);

  const [chats, setChats] = useState<ChatRecord[]>(initialChats);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const { socket, isConnected } = useSocket();
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  // updates the chat and pushes latest chat to top
  const updateChatList = useCallback((chat: ChatRecord) => {
    setChats((prevChats) => {
      const filteredChats = prevChats.filter((c) => c.id !== chat.id);
      return [chat, ...filteredChats];
    });
  }, []);

  const updateCurrentChatMessages = useCallback(
    (message: Message) => {
      if (activeChatId === message.chatId) {
        setCurrentChatMessages((prevMsgs) => (prevMsgs ? [...prevMsgs, message] : []));
      }
    },
    [activeChatId]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      if (socket && isConnected) {
        if (!joinedRoomsRef.current.has(roomId)) {
          socket.emit("join-room", roomId);
          joinedRoomsRef.current.add(roomId);
        }
      }
    },
    [socket, isConnected]
  );

  // join all chat rooms for logged in user
  useEffect(() => {
    chats.forEach((chat) => joinRoom(chat.id));
  }, [chats, joinRoom]);

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

    const handleNewChat = ({ sender, data }: DataForReceiver) => {
      const { message, chat } = data;
      // receiver joins the room for future messages
      joinRoom(chat.id);
      const chatRecord = createChatRecord({
        chat,
        message,
        muted: false,
        user: sender,
      });

      // update UI on receiver side
      updateChatList(chatRecord);
    };
    socket.on("new-chat", handleNewChat);

    return () => {
      socket.off("new-chat", handleNewChat);
    };
  }, [socket, joinRoom, updateChatList]);

  // add receive-message event listener to socket
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg: Message) => {
      updateCurrentChatMessages(msg);
      const existingChat = chats.find((c) => c.id === msg.chatId);

      // chat must exist becasue it was created when new-chat event occurred
      if (!existingChat) return;

      const chatRecord = createChatRecord({
        chat: existingChat,
        message: msg,
        muted: existingChat.muted,
        user: existingChat.user,
      });

      // update chat list
      updateChatList(chatRecord);
    };

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [socket, updateCurrentChatMessages, updateChatList, chats]);

  return (
    <ChatContext
      value={{
        activeChatId,
        setActiveChatId,
        activeChatUser,
        setActiveChatUser,
        chats,
        joinRoom,
        setChats,
        updateChatList,
        currentChatMessages,
        setCurrentChatMessages,
        updateCurrentChatMessages,
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
