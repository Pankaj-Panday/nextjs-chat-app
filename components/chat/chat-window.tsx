"use client";

import { AppUser } from "@/types/user";
import { useChat } from "@/context/chat-context";
import { EmptyChatWindow } from "./empty-chat-window";
import { MessageChatWindow } from "./message-chat-window";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { FormEvent } from "react";
import { sendMessage } from "@/actions/chat-actions";
import { useSocket } from "@/context/socket-context";

interface ChatWindowProps {
  currentUser: AppUser;
}

export const ChatWindow = ({ currentUser }: ChatWindowProps) => {
  const { activeChatId, setActiveChatId, updateChats, updateCurrentChat, activeChatUser } = useChat();
  const [message, setMessage] = useState("");
  const { socket } = useSocket();

  if (!activeChatId && !activeChatUser) return <EmptyChatWindow />;

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // call server action here
    const msg = await sendMessage(message, {
      senderId: currentUser.id,
      chatId: activeChatId,
      receiverId: activeChatUser?.id,
    });
    if (!msg) return;

    // Emit socket event after DB save
    socket?.emit("new-message", msg);

    if (msg.isInNewChat) {
      setActiveChatId(msg.chatId);
      socket?.emit("new-chat", { roomId: msg.chatId, userId: activeChatUser ? activeChatUser.id : null });
    }

    // update UI
    updateCurrentChat(msg);
    updateChats(msg);
    setMessage("");
  };

  return (
    <>
      {/* topbar */}
      <div className="h-16 px-3 py-2 flex items-center border-b">
        {/* user avatar */}
        <div className="flex gap-2 items-center">
          <Avatar className="size-10">
            <AvatarImage src={activeChatUser?.image ?? undefined} />
            <AvatarFallback>{activeChatUser?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <p className="font-semibold">{activeChatUser?.name}</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col px-3 pb-3 overflow-y-hidden">
        <MessageChatWindow currentUser={currentUser} />
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 border rounded-full px-3 py-2 mt-2">
          <Input
            autoFocus
            autoComplete="off"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
