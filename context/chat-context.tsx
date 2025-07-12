"use client";

import { createContext, useContext, useState } from "react";

type ChatContextType = {
  activeChatId: string;
  setActiveChatId: (id: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeChatId, setActiveChatId] = useState("");

  return <ChatContext value={{ activeChatId, setActiveChatId }}>{children}</ChatContext>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
