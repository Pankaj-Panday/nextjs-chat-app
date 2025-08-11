import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { AppUser } from "@/types/user";
import { Chat, ChatMessagePayload } from "@/types/chat-types";

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

export const getChatReceiver = (participants: AppUser[] | undefined, currentUser: AppUser): AppUser => {
  if (!participants) {
    throw new Error("Participants are required");
  }

  if (participants.length !== 2) {
    throw new Error("Only 1-on-1 chat should use getChatReceiver");
  }
  const receiver = participants.find((participant) => participant.id !== currentUser.id);
  if (!receiver) {
    throw new Error("Receiver not found");
  }
  return receiver;
};

export function createNewChatRecord(
  data: Omit<ChatMessagePayload & { user: AppUser | null }, "isNewChat">
): Chat | undefined {
  const { message, chat, user } = data;
  if (!user) return;

  return {
    id: message.chatId,
    name: chat?.name,
    isGroup: chat?.isGroup ?? false,
    lastMessage: {
      content: message.content,
      mediaUrl: message.mediaUrl,
      type: message.type,
    },
    lastRead: null, // modify it
    muted: false,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    }, // if oauth field exist in user, remove it
    participants: undefined, // maybe modify it for group chat
  };
}
