"use server";

import { prisma } from "@/lib/prisma";
import { Message } from "@/types/chat-types";

export async function getChatMessagesByChatId(chatId: string) {
  try {
    if (!chatId) throw new Error("No chat id given");

    const chatMessages = await prisma.message.findMany({
        where: {
          chatId: chatId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

    const messages = chatMessages.map((msg) => {
      return {
        id: msg.id,
        chatId: msg.chatId,
        sender: msg.senderId,
        content: msg.content,
        sentAt: msg.createdAt,
      };
    });

    return {
      id: chatId,
      messages,
    };
  } catch (error) {
    if (error instanceof Error) throw new Error("Error getting chat data: " + error.message);
  }
}

export async function sendMessage(
  content: string,
  { senderId, chatId }: { senderId: string; chatId: string | null }
): Promise<Message | undefined> {
  try {
    if (!senderId || !chatId) throw new Error("Invalid sender or chat ID.");

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        chatId,
        content,
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessageId: newMessage.id,
      },
    });

    return {
      id: newMessage.id,
      chatId: newMessage.chatId,
      sender: newMessage.senderId,
      sentAt: newMessage.createdAt,
      content: newMessage.content,
    };
  } catch (error) {
    if (error instanceof Error) throw new Error("Error sending message: " + error.message);
  }
}
