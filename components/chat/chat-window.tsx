"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizonal } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { AppUser } from "@/types/user";
import { useChat } from "@/context/chat-context";
import { EmptyChatWindow } from "./empty-chat-window";
import { useEffect, useState } from "react";
import { getChatDataById } from "@/actions/chat-actions";
import { Message, Participant } from "@/types/chat-types";
import { getChatReceiver } from "@/lib/utils";

interface ChatWindowProps {
  currentUser: AppUser;
}

export const ChatWindow = ({ currentUser }: ChatWindowProps) => {
  const { activeChatId } = useChat();
  const [chatData, setChatData] = useState<{
    messages: Message[];
    participants: Participant[];
  } | null>(null);

  useEffect(() => {
    if (!activeChatId) return;

    const fetchChatData = async () => {
      const data = await getChatDataById(activeChatId);
      if (data) setChatData(data);
    };

    fetchChatData();
  }, [activeChatId]);

  if (!activeChatId || !chatData) return <EmptyChatWindow />;

  const { messages, participants } = chatData;
  const receiver = getChatReceiver(participants, currentUser) as Participant;

  return (
    <>
      {/* topbar */}
      <div className="h-16 px-3 py-2 flex items-center border-b">
        {/* user avatar */}
        <div className="flex gap-2 items-center">
          <Avatar className="size-10">
            <AvatarImage src={receiver?.image || ""} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <p className="font-semibold">{receiver?.name}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3 overflow-y-hidden">
        {/* chat scroll area */}
        <ScrollArea className="flex-1 px-8 py-2 min-h-2">
          <div className="flex flex-col gap-2 ">
            {messages?.map((msg) => (
              <ChatMessage key={msg.id} message={msg} isOwn={msg.sender === currentUser.id} />
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
