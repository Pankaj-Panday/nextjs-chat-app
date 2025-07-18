import { getChatDataById } from "@/actions/chat-actions";
import { Message, Participant } from "@/types/chat-types";
import { useEffect, useState } from "react";

export const useCurrentChatData = (chatId: string | null) => {
  const [currentChatData, setCurrentChatData] = useState<{
    messages: Message[];
    participants: Participant[];
  } | null>(null);

  useEffect(() => {
    const fetchCurrentChatData = async () => {
      if(!chatId) return;
      const data = await getChatDataById(chatId);
      if(data) setCurrentChatData(data);
    }
    fetchCurrentChatData();
  }, [chatId]);

  return { currentChatData, setCurrentChatData };
};
