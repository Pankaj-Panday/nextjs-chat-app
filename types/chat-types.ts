export type ChatListItem = {
  id: string;
  lastRead: Date | null;
  muted: boolean;
  Chat: {
    id: string;
    isGroup: boolean;
    name: string | null;
    lastMessage: {
      content: string;
    } | null;
  } | null;
};
