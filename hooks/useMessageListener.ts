import { useChat } from "@/context/chat-context";
import { useSocket } from "@/context/socket-context";
import { useCurrentChatData } from "./useCurrentChatData";
import { useEffect } from "react";
import { Message } from "@/types/chat-types";

export const useMessageListener = (chatId: string | null) => {
  const { socket } = useSocket();
  const { setChats } = useChat();
  const { setCurrentChatData } = useCurrentChatData(chatId);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (newMsg: Message) => {
      // update the current chat data
      if (chatId && (chatId === newMsg.chatId)) {
        setCurrentChatData((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
      }

      // update last message of chat list
      setChats((prev) => {
        const updatedChats = prev.map((chat) => {
          if (chat.chatId === newMsg.chatId) return { ...chat, lastMessage: newMsg.content };
          return chat;
        });
        return updatedChats;
      });
    };

    socket.on("receive-message", handleIncomingMessage);

    return () => {
      socket.off("receive-message", handleIncomingMessage);
    };
  }, [chatId, socket, setChats, setCurrentChatData]);
};
