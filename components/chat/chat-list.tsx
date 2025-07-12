"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatCard } from "./chat-card";
import { ChatItem } from "@/types/chat-types";
import { AppUser } from "@/types/user";
import { useChat } from "@/context/chat-context";

interface ChatListProps {
  chats: ChatItem[];
  currentUser: AppUser;
}

export const ChatList = ({ chats, currentUser }: ChatListProps) => {
  const { activeChatId, setActiveChatId } = useChat();

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
