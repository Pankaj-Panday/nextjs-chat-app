import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { AppUser } from "@/types/user";
import { prisma } from "@/lib/prisma";

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

export async function findOrCreateChat(senderId: string, receiverId: string) {
  console.time("FindFirst");
  const existingChat = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      userChats: {
        some: {
          userId: senderId,
        },
      },
      AND: {
        userChats: {
          some: {
            userId: receiverId,
          },
        },
      },
    },
  });
  console.timeEnd("FindFirst");

  if (existingChat) {
    return { chat: existingChat, isNew: false };
  }

  console.time("create chat");
  const newChat = await prisma.chat.create({
    data: {
      isGroup: false,
      userChats: {
        create: [{ user: { connect: { id: senderId } } }, { user: { connect: { id: receiverId } } }],
      },
    },
  });
  console.timeEnd("create chat");

  return { chat: newChat, isNew: true };
}
