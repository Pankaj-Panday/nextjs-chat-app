"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatCard } from "./chat-card";
import { useChat } from "@/context/chat-context";

export const ChatList = ({ search }: { search: string }) => {
  const { activeChatId, setActiveChatId, setActiveChatUser, chats } = useChat();

  const filteredChats = chats.filter((chat) => chat.user?.name?.toLowerCase().startsWith(search.toLowerCase()));

  return (
    <ScrollArea className="flex flex-1 gap-4 h-full flex-col">
      <div className="flex flex-col gap-1 pr-3 pb-3">
        {filteredChats.length > 0 &&
          filteredChats.map((chat) => {
            return (
              <ChatCard
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setActiveChatUser(chat.user);
                }}
              />
            );
          })}
      </div>
    </ScrollArea>
  );
};
