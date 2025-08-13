import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { AppUser } from "@/types/user";
import { Chat, ChatRecord, DataForReceiver, Message } from "@/types/chat-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassowrd = await bcrypt.hash(password, salt);
  return hashedPassowrd;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

export function createDataForReceiver({
  sender,
  receiver,
  chat,
  message,
}: {
  sender: AppUser;
  receiver: AppUser;
  chat: Chat;
  message: Message;
}): DataForReceiver & { recieverId: string } {
  return {
    sender,
    recieverId: receiver.id,
    data: {
      chat: {
        id: chat.id,
        isGroup: chat.isGroup,
        name: chat.name,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
      message: {
        type: message.type,
        content: message.content,
        mediaUrl: message.mediaUrl,
      },
    },
  };
}

export function createChatRecord({
  chat,
  message,
  muted = false,
  user,
}: {
  chat: Chat | ChatRecord;
  message: Partial<Message>;
  muted?: boolean;
  user: AppUser | null;
}): ChatRecord {
  return {
    id: chat.id,
    name: chat.name,
    isGroup: chat.isGroup,
    lastMessage: { type: message.type, content: message.content, mediaUrl: message.mediaUrl },
    lastRead: null,
    muted,
    user,
    participants: undefined,
  };
}
