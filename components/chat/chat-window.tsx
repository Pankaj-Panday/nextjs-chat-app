"use client";

import { useChat } from "@/context/chat-context";
import { EmptyChatWindow } from "./empty-chat-window";
import { MessageChatWindow } from "./message-chat-window";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { FormEvent } from "react";
import { sendMessage } from "@/actions/chat-actions";
import { useSocket } from "@/context/socket-context";
import { createNewChatRecord } from "@/lib/utils";
import { useAuth } from "@/context/user-context";
import { ChatInput } from "./chat-input";

export const ChatWindow = () => {
  const { activeChatId, setActiveChatId, updateChats, updateCurrentChat, activeChatUser } = useChat();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const { socket } = useSocket();

  if (!activeChatId && !activeChatUser) return <EmptyChatWindow />;

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeChatUser || !message.trim()) return;

    setLoading(true);

    try {
      const data = await sendMessage(message, {
        senderId: currentUser.id,
        chatId: activeChatId ?? undefined,
        receiverId: activeChatUser?.id,
      });
      if (!data) return;

      // Emit socket event after DB save
      socket?.emit("new-message", data.message);

      if (data.isNewChat && data.chat) {
        setActiveChatId(data.chat.id); // can also use setActiveChatId(data.message.chatId);
        const newChatRecordForReceiver = createNewChatRecord({
          chat: data.chat,
          message: data.message,
          user: currentUser,
        });
        socket?.emit("new-chat", {
          roomId: data.chat.id,
          receiverId: activeChatUser.id,
          chatData: newChatRecordForReceiver,
        });
      }

      // update UI
      updateCurrentChat(data.message);
      updateChats({ ...data, user: activeChatUser });
      setMessage("");
    } finally {
      setLoading(false);
    }
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
        <MessageChatWindow />
        <ChatInput message={message} setMessage={setMessage} onSend={handleSendMessage} loading={loading} />
      </div>
    </>
  );
};
