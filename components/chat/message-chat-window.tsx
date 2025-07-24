"use client";

import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { AppUser } from "@/types/user";
import { useChat } from "@/context/chat-context";

interface MessageChatWindowProps {
  currentUser: AppUser;
}

export const MessageChatWindow = ({ currentUser }: MessageChatWindowProps) => {
  const { currentChatMessages } = useChat();


  return (
    <>
      {/* chat scroll area */}
      <ScrollArea className="flex-1 px-8 pb-2 min-h-2">
        <div className="flex flex-col">
          {currentChatMessages?.map((msg) => (
            <ChatMessage key={msg.id} message={msg} isOwn={msg.sender === currentUser.id} />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};
