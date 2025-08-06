import { AppUser } from "./user";

export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "FILE" | "AUDIO";

export type Message = {
  id: string;
  type: MessageType;
  chatId: string;
  sender: string;
  content?: string | null;
  mediaUrl?: string | null;
  sentAt: Date;
};

export type Chat = {
  id: string;
  name?: string | null;
  isGroup: boolean;
  lastRead?: Date | null; // may have to modify this
  muted?: boolean;
  lastMessage?: {
    type?: MessageType;
    content?: string | null;
    mediaUrl?: string | null;
  };
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
