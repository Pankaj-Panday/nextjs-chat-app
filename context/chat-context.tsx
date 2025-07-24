"use client";

import { ChatItem, ExtendedMessage, Message } from "@/types/chat-types";
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
  currentChatMessages: any;
  setCurrentChatMessages: any;
  updateCurrentChat: (msg: ExtendedMessage) => void;
  fetchCurrentChatData: any;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({
  currentUser,
  children,
  initialChats,
}: {
  currentUser: AppUser;
  children: React.ReactNode;
  initialChats: ChatItem[];
}) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<AppUser | null>(null);

  const [chats, setChats] = useState(initialChats);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const { socket, isConnected } = useSocket();
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  const updateChats = useCallback(
    (msg) => {
      console.log("Updating chats with msg", msg);
      setChats((prevChats) => {
        // if the chat is old, update it, if the chat is new, push the new record
        if (msg.isInNewChat) {
          const newChatRecord = {
            id: msg.chat.id,
            chatId: msg.chatId,
            isGroup: msg.chat.isGroup,
            lastMessage: msg.content,
            lastRead: msg.chat.lastRead,
            muted: msg.chat.muted,
            name: msg.chat.name,
            participants: !msg.chat.isGroup ? [{ ...currentUser }, { ...activeChatUser }] : undefined,
          };
          return [newChatRecord, ...prevChats];
        }
        return prevChats.map((chat) => (chat.chatId === msg.chatId ? { ...chat, lastMessage: msg.content } : chat));
      });
    },
    [activeChatUser, currentUser]
  );

  const updateCurrentChat = useCallback(
    (msg: ExtendedMessage) => {
      if (activeChatId === msg.chatId) {
        const newMsg: Message = {
          chatId: msg.chatId,
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          sentAt: msg.sentAt,
        };
        setCurrentChatMessages((prevMsgs) => (prevMsgs ? [...prevMsgs, newMsg] : null));
      }
    },
    [activeChatId]
  );

  const fetchCurrentChatData = useCallback(async (chatId: string) => {
    return await getChatMessagesByChatId(chatId);
  }, []);

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

  // if activeChatId changes and user hasn't joined that room make them join the room - for new chats
  useEffect(() => {
    if (!socket || !activeChatId) return;
    if (!joinedRoomsRef.current.has(activeChatId)) {
      socket.emit("join-room", activeChatId);
      joinedRoomsRef.current.add(activeChatId);
    }
  }, [socket, activeChatId]);


  // add receive-message event listener to socket
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg: Message) => {
      console.log("Fired receive -message for", msg);
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
        setCurrentChatMessages,
        updateCurrentChat,
        fetchCurrentChatData,
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
