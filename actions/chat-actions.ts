"use server";

import { prisma } from "@/lib/prisma";
import { findOrCreateChat } from "@/lib/utils";
import { ChatItem, ExtendedMessage } from "@/types/chat-types";

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
) {
  try {
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

    let chat, formattedChat;
    // if its an old chat simply update last message
    if (!isNewChat) {
      chat = await prisma.chat.update({
        where: { id: finalChatId },
        data: { lastMessageId: newMessage.id },
      });
    } else {
      // if its new chat, also return other fields
      chat = await prisma.chat.update({
        where: { id: finalChatId },
        data: { lastMessageId: newMessage.id },
        select: {
          isGroup: true,
          name: true,
          userChats: {
            where: {
              userId: senderId,
            },
            select: {
              id: true,
              lastRead: true,
              muted: true,
            },
          },
        },
      });

      formattedChat = {
        id: chat.userChats[0].id,
        isGroup: chat.isGroup,
        name: chat.name,
        lastRead: chat.userChats[0].lastRead,
        muted: chat.userChats[0].muted,
      };
    }

    return {
      id: newMessage.id,
      chatId: newMessage.chatId,
      sender: newMessage.senderId,
      sentAt: newMessage.createdAt,
      content: newMessage.content,
      isInNewChat: isNewChat,
      chat: isNewChat ? formattedChat : null,
    };
  } catch (error) {
    if (error instanceof Error) throw new Error("Error sending message: " + error.message);
  }
}
