"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import userImg from "@/demo-data/user.jpeg";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizonal } from "lucide-react";
import { mockMessages } from "@/demo-data/chat-list-data";
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./chat-message";

export const ChatWindow = () => {
  const currentUserId = "user-123";
  return (
    <>
      {/* topbar */}
      <div className="h-16 px-3 py-2 flex items-center border-b">
        {/* user avatar */}
        <div className="flex gap-2 items-center">
          <Avatar className="size-10">
            <AvatarImage src={userImg.src} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <p className="font-semibold">UserName</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3 overflow-y-hidden">
        {/* chat scroll area */}
        <ScrollArea className="flex-1 px-8 py-2 min-h-2">
          <div className="flex flex-col gap-2 ">
            {mockMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} isOwn={msg.senderId === currentUserId} />
            ))}
          </div>
        </ScrollArea>

        <form className="flex items-center gap-2 border rounded-full px-3 py-2 mt-2">
          <Input
            type="text"
            placeholder="Type a message"
            className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button type="submit" size="icon" className="rounded-full">
            <SendHorizonal />
          </Button>
        </form>
      </div>
    </>
  );
};
