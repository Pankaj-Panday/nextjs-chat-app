"use server";

import { prisma } from "@/lib/prisma";
import { findOrCreateChat } from "@/lib/utils";
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
  { senderId, chatId, receiverId }: { senderId: string; chatId: string | null; receiverId?: string }
): Promise<Message | undefined> {
  try {
    if (!senderId || (!chatId && !receiverId)) {
      throw new Error("Invalid sender or chat ID.");
    }

    let finalChatId = chatId;

    // if chatId isn't provided find or create the chat based on the senderId and receiverId
    if (!finalChatId && receiverId) {
      // find if chat already exist between sender and receiver
      const chat = await findOrCreateChat(senderId, receiverId);
      finalChatId = chat.id;
    }

    if (!finalChatId) {
      throw new Error("Couldn't find or create chat");
    }

    // create the message record
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        chatId: finalChatId,
        content,
      },
    });

    // update the lastMessage of the chat
    await prisma.chat.update({
      where: { id: finalChatId },
      data: { lastMessageId: newMessage.id },
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
