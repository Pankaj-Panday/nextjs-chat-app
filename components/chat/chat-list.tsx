"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatCard } from "./chat-card";
import { AppUser } from "@/types/user";
import { useChat } from "@/context/chat-context";
import { useMessageListener } from "@/hooks/useMessageListener";

interface ChatListProps {
  currentUser: AppUser;
}

export const ChatList = ({ currentUser }: ChatListProps) => {
  const { activeChatId, setActiveChatId, chats } = useChat();
  useMessageListener(activeChatId);

  return (
    <ScrollArea className="flex flex-1 gap-4 h-full flex-col">
      <div className="flex flex-col gap-1 pr-3 pb-3">
        {chats.map((chat) => {
          return (
            <ChatCard
              key={chat.id}
              chat={chat}
              isActive={chat.chatId === activeChatId}
              onClick={setActiveChatId}
              currentUser={currentUser}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};
