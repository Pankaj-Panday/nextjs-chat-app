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
