"use client";

import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { useChat } from "@/context/chat-context";
import { Message } from "@/types/chat-types";
import { useAuth } from "@/context/user-context";

export const MessageChatWindow = () => {
  const { currentChatMessages } = useChat();
  const { currentUser } = useAuth();

  return (
    <>
      {/* chat scroll area */}
      <ScrollArea className="flex-1 px-8 py-2 min-h-2">
        <div className="flex flex-col gap-2">
          {currentChatMessages?.map((msg: Message) => (
            <ChatMessage key={msg.id} message={msg} isOwn={msg.sender === currentUser.id} />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};
