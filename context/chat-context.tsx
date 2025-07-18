"use client";

import { ChatItem } from "@/types/chat-types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./socket-context";

type ChatContextType = {
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  chats: ChatItem[];
  setChats: React.Dispatch<React.SetStateAction<ChatItem[]>>;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children, initialChats }: { children: React.ReactNode; initialChats: ChatItem[] }) => {
  const [activeChatId, setActiveChatId] = useState("");
  const [chats, setChats] = useState<ChatItem[]>(initialChats);
  const { socket, isConnected } = useSocket();
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  // join all chat rooms for logged in user
  useEffect(() => {
    if (socket && isConnected) {
      chats.forEach((chat) => {
        if (!joinedRoomsRef.current.has(chat.chatId)) {
          socket.emit("join-room", chat.chatId);
          joinedRoomsRef.current.add(chat.chatId);
        }
      });
    }
  }, [chats, isConnected, socket]);

  return <ChatContext value={{ activeChatId, setActiveChatId, chats, setChats }}>{children}</ChatContext>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
