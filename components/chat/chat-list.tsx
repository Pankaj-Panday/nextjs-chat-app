"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatCard } from "./chat-card";
import { AppUser } from "@/types/user";
import { useChat } from "@/context/chat-context";
import { getChatReceiver } from "@/lib/utils";

interface ChatListProps {
  currentUser: AppUser;
}

export const ChatList = ({ currentUser }: ChatListProps) => {
  const { activeChatId, setActiveChatId, setActiveChatUser, chats } = useChat();

  return (
    <ScrollArea className="flex flex-1 gap-4 h-full flex-col">
      <div className="flex flex-col gap-1 pr-3 pb-3">
        {chats.length > 0 &&
          chats.map((chat) => {
            const receiver = chat.isGroup
              ? { name: chat.name, image: "" }
              : getChatReceiver(chat.participants, currentUser);

            return (
              <ChatCard
                key={chat.id}
                chat={chat}
                isActive={chat.chatId === activeChatId}
                onClick={() => {
                  setActiveChatId(chat.chatId);
                  setActiveChatUser(receiver as AppUser);
                }}
                receiver={receiver as AppUser}
              />
            );
          })}
      </div>
    </ScrollArea>
  );
};
