export type Participant = {
  id: string;
  name: string | null;
  image: string | null;
};

export type ChatItem = {
  id: string;
  chatId: string;
  isGroup?: boolean | null;
  name?: string | null;
  lastMessage?: string | null;
  participants: Participant[] | undefined;
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
