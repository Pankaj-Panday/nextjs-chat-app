"use client";

import { ChatItem, Message } from "@/types/chat-types";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./socket-context";
import { getChatMessagesByChatId } from "@/actions/chat-actions";
import { AppUser } from "@/types/user";

type ChatContextType = {
  activeChatId: string | null;
  setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
  chats: ChatItem[];
  activeChatUser: AppUser | null;
  setActiveChatUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
  setChats: React.Dispatch<React.SetStateAction<ChatItem[]>>;
  updateChats: (msg: Message) => void;
  currentChatMessages: Message[] | null;
  updateCurrentChat: (msg: Message) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children, initialChats }: { children: React.ReactNode; initialChats: ChatItem[] }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<AppUser | null>(null);

  const [chats, setChats] = useState(initialChats);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[] | null>(null);
  const { socket, isConnected } = useSocket();
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  const updateChats = useCallback((newMsg: Message) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => (chat.chatId === newMsg.chatId ? { ...chat, lastMessage: newMsg.content } : chat));
    });
  }, []);

  const updateCurrentChat = useCallback(
    (newMsg: Message) => {
      if (activeChatId === newMsg.chatId) 
        setCurrentChatMessages((prevMsgs) => (prevMsgs ? [...prevMsgs, newMsg] : null));
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
      if (!activeChatId) {
        setCurrentChatMessages([])
        return;
      } 
      const data = await getChatMessagesByChatId(activeChatId);
      if (data) setCurrentChatMessages(data.messages);
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
      value={{
        activeChatId,
        setActiveChatId,
        activeChatUser,
        setActiveChatUser,
        chats,
        setChats,
        updateChats,
        currentChatMessages,
        updateCurrentChat,
      }}
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
