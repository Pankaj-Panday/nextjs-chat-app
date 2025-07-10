"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chats } from "@/demo-data/chat-list-data";
import { ChatCard } from "./chat-card";
import { useState } from "react";

export const ChatList = () => {
  const [activeChat, setActiveChat] = useState("");

  return (
    <ScrollArea className="flex flex-1 gap-4 h-full flex-col">
      <div className="flex flex-col gap-1 pr-3 pb-3">
        {chats.map((chat) => {
          return <ChatCard key={chat.id} chat={chat} isActive={chat.id === activeChat} onClick={setActiveChat} />;
        })}
      </div>
    </ScrollArea>
  );
};
