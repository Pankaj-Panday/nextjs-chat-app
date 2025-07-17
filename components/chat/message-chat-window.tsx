"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizonal } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { FormEvent, useEffect, useState } from "react";
import { ChatItem, Message, Participant } from "@/types/chat-types";
import { AppUser } from "@/types/user";
import { useChat } from "@/context/chat-context";
import { getChatDataById, sendMessage } from "@/actions/chat-actions";
import { getChatReceiver } from "@/lib/utils";
import { useSocket } from "@/context/socket-context";

interface MessageChatWindowProps {
  currentUser: AppUser;
}

export const MessageChatWindow = ({ currentUser }: MessageChatWindowProps) => {
  const [message, setMessage] = useState("");
  const { activeChatId, setChats } = useChat();
  const { socket } = useSocket();

  const [chatData, setChatData] = useState<{
    messages: Message[];
    participants: Participant[];
  } | null>(null);

  useEffect(() => {
    if (!activeChatId || !socket) return;

    socket.emit("join-room", activeChatId);

    const handleIncomingMessage = (newMsg: Message) => {
      if (newMsg.chatId === activeChatId) {
        setChatData((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
      }
      setChats((prevChats) => {
        const chatExists = prevChats.find((c: ChatItem) => c.chatId === newMsg.chatId);
        if (!chatExists) return prevChats;

        const updatedChats = prevChats.map((chat: ChatItem) => {
          if (chat.chatId === newMsg.chatId) return { ...chat, lastMessage: newMsg.content };
          return chat;
        });
        console.log(updatedChats);
        return updatedChats;
      });
    };

    socket.on("receive-message", handleIncomingMessage);

    const fetchChatData = async () => {
      const data = await getChatDataById(activeChatId);
      if (data) setChatData(data);
    };

    fetchChatData();

    return () => {
      socket.emit("leave-room", activeChatId); // leave room when component unmounts
    };
  }, [activeChatId, socket, setChats]);

  if (!chatData) return null;

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // call server action here
    const newMsg = await sendMessage(message, { senderId: currentUser.id, chatId: activeChatId });
    if (!newMsg) return;

    // Emit socket event after DB save
    socket?.emit("new-message", newMsg);

    // update UI
    setChatData((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat: ChatItem) => {
        if (chat.chatId === newMsg.chatId) return { ...chat, lastMessage: newMsg.content };
        return chat;
      });
      return updatedChats;
    });

    setMessage("");
  };

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

      <div className="flex-1 flex flex-col px-3 pb-3 overflow-y-hidden">
        {/* chat scroll area */}
        <ScrollArea className="flex-1 px-8 pb-2 min-h-2">
          <div className="flex flex-col gap-2">
            {messages?.map((msg) => (
              <ChatMessage key={msg.id} message={msg} isOwn={msg.sender === currentUser.id} />
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="flex items-center gap-2 border rounded-full px-3 py-2 mt-2">
          <Input
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
