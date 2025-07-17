"use client";

import { ChatItem } from "@/types/chat-types";
import { createContext, useContext, useState } from "react";

type ChatContextType = {
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  chats: ChatItem[];
  setChats: (chats: ChatItem[]) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children, initialChats }: { children: React.ReactNode; initialChats: ChatItem[] }) => {
  const [activeChatId, setActiveChatId] = useState("");
  const [chats, setChats] = useState(initialChats);

  return <ChatContext value={{ activeChatId, setActiveChatId, chats, setChats }}>{children}</ChatContext>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
