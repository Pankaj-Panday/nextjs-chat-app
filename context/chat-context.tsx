"use client";

import { ChatItem, Message, Participant } from "@/types/chat-types";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./socket-context";
import { getChatDataById } from "@/actions/chat-actions";

type CurrentChat = {
  messages: Message[];
  participants: Participant[];
} | null;

type ChatContextType = {
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  chats: ChatItem[];
  setChats: React.Dispatch<React.SetStateAction<ChatItem[]>>;
  updateChats: (msg: Message) => void;
  currentChatData: CurrentChat;
  updateCurrentChat: (msg: Message) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children, initialChats }: { children: React.ReactNode; initialChats: ChatItem[] }) => {
  const [activeChatId, setActiveChatId] = useState("");
  const [chats, setChats] = useState(initialChats);
  const [currentChatData, setCurrentChatData] = useState<CurrentChat>(null);
  const { socket, isConnected } = useSocket();
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  const updateChats = useCallback((newMsg: Message) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => (chat.chatId === newMsg.chatId ? { ...chat, lastMessage: newMsg.content } : chat));
    });
  }, []);

  const updateCurrentChat = useCallback(
    (newMsg: Message) => {
      if (activeChatId === newMsg.chatId) {
        setCurrentChatData((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
      }
    },
    [activeChatId]
  );

  // join all chat rooms for logged in user
  useEffect(() => {
    if (socket && isConnected) {
      chats.forEach((chat) => {
        if (!joinedRoomsRef.current.has(chat.chatId)) {
          socket.emit("join-room", chat.chatId);
          joinedRoomsRef.current.add(chat.chatId);
        }
      });
    }
  }, [chats, isConnected, socket]);

  // fetch current chat data
  useEffect(() => {
    const fetchCurrentChatData = async () => {
      if (!activeChatId) return;
      const data = await getChatDataById(activeChatId);
      if (data) setCurrentChatData(data);
    };
    fetchCurrentChatData();
  }, [activeChatId]);

  // add receive-message event listener to socket
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg: Message) => {
      updateCurrentChat(msg);
      updateChats(msg);
    };

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [socket, updateCurrentChat, updateChats]);

  return (
    <ChatContext
      value={{ activeChatId, setActiveChatId, chats, setChats, updateChats, currentChatData, updateCurrentChat }}
    >
      {children}
    </ChatContext>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
