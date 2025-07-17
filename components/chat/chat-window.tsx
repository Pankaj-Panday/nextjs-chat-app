"use client";

import { AppUser } from "@/types/user";
import { useChat } from "@/context/chat-context";
import { EmptyChatWindow } from "./empty-chat-window";
import { MessageChatWindow } from "./message-chat-window";

interface ChatWindowProps {
  currentUser: AppUser;
}

export const ChatWindow = ({ currentUser }: ChatWindowProps) => {
  const { activeChatId } = useChat();

  if (!activeChatId) return <EmptyChatWindow />;
  return <MessageChatWindow currentUser={currentUser} />;
};
