import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { Participant } from "@/types/chat-types";
import { AppUser } from "@/types/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function hashPassword(password: string) : Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassowrd = await bcrypt.hash(password, salt);
  return hashedPassowrd;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}


export const getChatReceiver = (participants: Participant[], currentUser: AppUser) => {
  if (participants.length > 2) {
    throw new Error("Group chat can't have single reciver");
  }
  return participants.find((participant) => participant.id !== currentUser.id);
};