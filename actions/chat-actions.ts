"use server";

import { prisma } from "@/lib/prisma";
import { findOrCreateChat } from "@/lib/utils";
import { Message, ChatMessagePayload } from "@/types/chat-types";

export async function getChatMessagesByChatId(chatId: string): Promise<Message[] | undefined> {
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

    return messages;
  } catch (error) {
    if (error instanceof Error) throw new Error("Error getting chat data: " + error.message);
  }
}

export async function sendMessage(
  content: string,
  { senderId, chatId, receiverId }: { senderId: string; chatId?: string; receiverId?: string }
): Promise<ChatMessagePayload | undefined> {
  try {
    // check if we have all required fields
    if (!senderId || (!chatId && !receiverId)) {
      throw new Error("Invalid sender or chat ID.");
    }

    let finalChatId = chatId;
    let isNewChat = false;

    // if chatId isn't provided find or create the chat based on the senderId and receiverId
    if (!finalChatId && receiverId) {
      // find if chat already exist between sender and receiver
      const { chat, isNew } = await findOrCreateChat(senderId, receiverId);
      finalChatId = chat.id;
      isNewChat = isNew;
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

    let chat;
    // if its an old chat simply update last message
    if (!isNewChat) {
      await prisma.chat.update({
        where: { id: finalChatId },
        data: { lastMessageId: newMessage.id },
      });
    } else {
      // if its new chat, also return other fields
      chat = await prisma.chat.update({
        where: { id: finalChatId },
        data: { lastMessageId: newMessage.id },
        select: {
          id: true,
          isGroup: true,
          name: true,
        },
      });
    }

    return {
      message: {
        id: newMessage.id,
        chatId: newMessage.chatId,
        sender: newMessage.senderId,
        sentAt: newMessage.createdAt,
        content: newMessage.content,
      },
      isNewChat: isNewChat,
      chat: isNewChat ? chat : undefined,
    };
  } catch (error) {
    if (error instanceof Error) throw new Error("Error sending message: " + error.message);
  }
}
