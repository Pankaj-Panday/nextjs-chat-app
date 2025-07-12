"use server";

import { prisma } from "@/lib/prisma";

export async function getChatDataById(chatId: string) {
  try {
    if (!chatId) throw new Error("No chat id given");

    const [chatMessages, chatParticipants] = await Promise.all([
      prisma.message.findMany({
        where: {
          chatId: chatId,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.userChat.findMany({
        where: {
          chatId: chatId,
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
    ]);

    const participants = chatParticipants.map((participant) => participant.user);

    const messages = chatMessages.map((msg) => {
      return {
        id: msg.id,
        sender: msg.senderId,
        content: msg.content,
        sentAt: msg.createdAt,
      };
    });

    return {
      id: chatId,
      messages,
      participants,
    };
  } catch (error) {
    if (error instanceof Error) throw new Error("Error getting chat data: " + error.message);
  }
}
