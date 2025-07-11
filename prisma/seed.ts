import { prisma } from "@/lib/prisma";

async function main() {
  const user1 = await prisma.user.findUnique({
    where: {
      email: "ppanday064@gmail.com",
    },
  });

  const user2 = await prisma.user.findUnique({
    where: {
      email: "ggleboy9@gmail.com",
    },
  });

  // 3. Create Chat
  const chat = await prisma.chat.create({
    data: {
      isGroup: false,
      userChats: {
        create: [{ user: { connect: { id: user1.id } } }, { user: { connect: { id: user2.id } } }],
      },
    },
  });

  // 4. Send Messages
  const msg1 = await prisma.message.create({
    data: {
      senderId: user1!.id,
      chatId: chat.id,
      content: "Hi Simran, ready to chat?",
    },
  });

  const msg2 = await prisma.message.create({
    data: {
      senderId: user2!.id,
      chatId: chat.id,
      content: "Yes, let’s go!",
    },
  });

  // 5. Update chat with last message
  await prisma.chat.update({
    where: { id: chat.id },
    data: {
      lastMessageId: msg2.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
