import { AppUser } from "./user";

export type Message = {
  id: string;
  chatId: string;
  sender: string;
  content?: string | null;
  sentAt: Date;
};

export type Chat = {
  id: string;
  name?: string | null;
  isGroup: boolean;
  lastRead?: Date | null; // may have to modify this
  muted?: boolean;
  lastMessage?: string | null;
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



