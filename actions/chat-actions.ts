"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { Message, MessageType } from "@/types/chat-types";
import { cookies } from "next/headers";

type TextMessage = {
  type: "TEXT";
  content: string;
  mediaUrl?: never;
};

type MediaMessage = {
  type: Exclude<MessageType, "TEXT">;
  content?: never;
  mediaUrl: string;
};

type SendMessageType = TextMessage | MediaMessage;

type SendMessageConfg = {
  senderId: string;
  chatId?: string;
  receiverId?: string;
};

async function findChat(senderId: string, receiverId: string) {
  const chat = await prisma.chat.findFirst({
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

  return chat;
}

async function createChat(senderId: string, receiverId: string) {
  const chat = await prisma.chat.create({
    data: {
      isGroup: false,
      userChats: {
        create: [{ user: { connect: { id: senderId } } }, { user: { connect: { id: receiverId } } }],
      },
    },
  });
  return chat;
}

async function insertNewMessageToChat(
  message: SendMessageType,
  { chatId, senderId }: { chatId: string; senderId: string }
) {
  try {
    // Save message to database
    const result = await prisma.$transaction(async (tx) => {
      const savedMessage = await tx.message.create({
        data: {
          senderId,
          chatId,
          type: message.type,
          content: message.content ?? null,
          mediaUrl: message.mediaUrl ?? null,
        },
      });
      // update the last message id of chat
      const updatedChat = await tx.chat.update({
        where: { id: chatId },
        data: { lastMessageId: savedMessage.id },
      });

      return { message: savedMessage, chat: updatedChat };
    });
    return result;
  } catch (error) {
    console.error("Error in insertNewMessageToChat:", error);
    throw new Error("Failed to send message");
  }
}

async function uploadImageToBucket(file: File, chatId: string): Promise<string> {
  try {
    // Intialize supabase client
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const folderPath = `${chatId}/images`;
    const fileName = `image-${Date.now()}-${file.name}`;
    const filePath = `${folderPath}/${fileName}`;

    // Upload to supabase-storage
    const { data, error } = await supabase.storage.from("chat-media").upload(filePath, file);
    if (error) {
      console.error("Error uploading image: ", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;

    return publicUrl;
  } catch (error) {
    if (error instanceof Error) throw new Error("Error sending file: " + error.message);
    throw new Error("Unknown error while sending file");
  }
}

export async function sendText(text: string, config: SendMessageConfg) {
  try {
    const { senderId, chatId, receiverId } = config;
    let finalChatId = chatId;

    // create chat if no chat exist
    if (!finalChatId && receiverId) {
      const existingChat = await findChat(senderId, receiverId);
      if (existingChat) {
        finalChatId = existingChat.id;
      } else {
        const newChat = await createChat(senderId, receiverId);
        finalChatId = newChat.id;
      }
    }

    if (!finalChatId) {
      throw new Error("Couldn't find or create chat");
    }

    const message: SendMessageType = {
      type: "TEXT",
      content: text,
    };

    // save message to chat
    const { message: msg, chat } = await insertNewMessageToChat(message, { senderId, chatId: finalChatId });

    return {
      message: {
        id: msg.id,
        type: msg.type,
        chatId: msg.chatId,
        sender: msg.senderId,
        content: msg.content,
        mediaUrl: msg.mediaUrl,
        sentAt: msg.createdAt,
      },
      chat,
    };
  } catch (error) {
    throw error;
  }
}

export async function sendImage(file: File, config: SendMessageConfg) {
  try {
    if (!file) throw new Error("No image provided");

    const { senderId, chatId, receiverId } = config;
    let finalChatId = chatId;

    // create chat if no chat exist
    if (!finalChatId && receiverId) {
      const existingChat = await findChat(senderId, receiverId);
      if (existingChat) {
        finalChatId = existingChat.id;
      } else {
        const newChat = await createChat(senderId, receiverId);
        finalChatId = newChat.id;
      }
    }

    if (!finalChatId) {
      throw new Error("Couldn't find or create chat");
    }

    // upload image to bucket
    const imageUrl = await uploadImageToBucket(file, finalChatId);

    const message: SendMessageType = {
      type: "IMAGE",
      mediaUrl: imageUrl,
    };

    // save message to chat
    const { message: msg, chat } = await insertNewMessageToChat(message, { senderId, chatId: finalChatId });

    return {
      message: {
        id: msg.id,
        type: msg.type,
        chatId: msg.chatId,
        sender: msg.senderId,
        content: msg.content,
        mediaUrl: msg.mediaUrl,
        sentAt: msg.createdAt,
      },
      chat,
    };
  } catch (error) {
    throw error;
  }
}

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
        type: msg.type,
        chatId: msg.chatId,
        sender: msg.senderId,
        content: msg.content,
        sentAt: msg.createdAt,
        mediaUrl: msg.mediaUrl,
      };
    });

    return messages;
  } catch (error) {
    if (error instanceof Error) throw new Error("Error getting chat data: " + error.message);
  }
}

export async function deleteImageFromBucket() {}
