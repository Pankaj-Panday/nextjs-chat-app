import { AppUser } from "./user";

export type ChatItem = {
  id: string;
  chatId: string;
  isGroup?: boolean | null;
  name?: string | null;
  lastMessage?: string | null;
  participants?: AppUser[];
  lastRead: Date | null;
  muted: boolean;
};

export type Message = {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  sentAt: Date;
};

export type Chat = {
  id: string;
  name?: string | null;
  isGroup: boolean;
  lastRead?: Date | null; // may have to modify this
  muted?: boolean;
  lastMessage?: string;
  user: AppUser | null;
  participants?: AppUser[];
};

export type ChatMessagePayload = {
  message: Message;
  isNewChat: boolean;
  chat?: {
    id: string;
    isGroup: boolean;
    name: string | null;
  };
};



