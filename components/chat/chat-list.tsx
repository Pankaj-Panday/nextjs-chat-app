"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatCard } from "./chat-card";
import { useChat } from "@/context/chat-context";

export const ChatList = () => {
  const { activeChatId, setActiveChatId, setActiveChatUser, chats } = useChat();

  return (
    <ScrollArea className="flex flex-1 gap-4 h-full flex-col">
      <div className="flex flex-col gap-1 pr-3 pb-3">
        {chats.length > 0 &&
          chats.map((chat) => {
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
