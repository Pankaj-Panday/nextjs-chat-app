"use client";

import { useChat } from "@/context/chat-context";
import { EmptyChatWindow } from "./empty-chat-window";
import { MessageChatWindow } from "./message-chat-window";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { FormEvent } from "react";
import { sendImage, sendText } from "@/actions/chat-actions";
import { useSocket } from "@/context/socket-context";
import { useAuth } from "@/context/user-context";
import { ChatInput } from "./chat-input";
import { ChatRecord, Chat, Message } from "@/types/chat-types";
import { createChatRecord, createDataForReceiver } from "@/lib/utils";
import { AppUser } from "@/types/user";

export const ChatWindow = () => {
  const { activeChatId, setActiveChatId, chats, joinRoom, updateChatList, updateCurrentChatMessages, activeChatUser } =
    useChat();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const { socket } = useSocket();

  if (!activeChatId && !activeChatUser) return <EmptyChatWindow />;

  const updateUI = (data: { message: Message; chat: Chat }) => {
    if (!activeChatUser) return;
    const { chat, message } = data;

    // find existing chat (to get value of muted)
    const existingChat = activeChatId ? chats.find((chat) => chat.id === activeChatId) : null;

    // create the chat record
    const chatRecord: ChatRecord = createChatRecord({
      chat,
      message,
      user: activeChatUser,
      muted: existingChat ? existingChat.muted : false,
    });

    updateChatList(chatRecord);
    setMessage("");
    setActiveChatId(data.chat.id);
    updateCurrentChatMessages(data.message);
  };

  const handleChatJoinAndSocketEmit = ({
    chat,
    message,
    sender,
    receiver,
    activeChatId,
  }: {
    chat: Chat;
    message: Message;
    receiver: AppUser;
    sender: AppUser;
    activeChatId?: string | null;
  }) => {
    // sender joins the room
    joinRoom(chat.id);

    // if there is no activeChatId, its a new chat, ask server to ask receiver to join room
    if (!activeChatId) {
      const dataForReceiver = createDataForReceiver({ chat, message, sender, receiver });
      socket?.emit("new-chat", dataForReceiver);
    }

    // emit new message event
    socket?.emit("new-message", message);
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeChatUser || !message.trim()) return;
    setLoading(true);
    try {
      const data = await sendText(message, {
        senderId: currentUser.id,
        receiverId: activeChatUser?.id,
        chatId: activeChatId ?? undefined,
      });

      updateUI(data);
      handleChatJoinAndSocketEmit({
        chat: data.chat,
        message: data.message,
        sender: currentUser,
        receiver: activeChatUser,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!activeChatUser || !file) return;
    try {
      setLoading(true);
      const data = await sendImage(file, {
        senderId: currentUser.id,
        receiverId: activeChatUser.id,
        chatId: activeChatId ?? undefined,
      });

      updateUI(data);
      handleChatJoinAndSocketEmit({
        chat: data.chat,
        message: data.message,
        sender: currentUser,
        receiver: activeChatUser,
      });
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
        <ChatInput
          message={message}
          setMessage={setMessage}
          onSend={handleSendMessage}
          loading={loading}
          onImageUpload={handleImageUpload}
        />
      </div>
    </>
  );
};
