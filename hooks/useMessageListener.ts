import { useChat } from "@/context/chat-context";
import { useSocket } from "@/context/socket-context";
import { useCurrentChatData } from "./useCurrentChatData";
import { useEffect } from "react";
import { Message } from "@/types/chat-types";

export const useMessageListener = (chatId: string | null) => {
  const { socket } = useSocket();
  const { updateChats } = useChat();
  const { setCurrentChatData } = useCurrentChatData(chatId);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleIncomingMessage = (newMsg: Message) => {
      console.log("running receive-message logic")
      // update the current chat data
      if (chatId && chatId === newMsg.chatId) {
        console.log("Setting current chat data");
        setCurrentChatData((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
      }

      // update last message of chat list
      updateChats(newMsg);
    };

    socket.on("receive-message", handleIncomingMessage);

    return () => {
      socket.off("receive-message", handleIncomingMessage);
    };
  }, [chatId, socket, updateChats, setCurrentChatData]);
};
