// import { prisma } from "@/lib/prisma";

// async function main() {
//   const user1 = await prisma.user.findUnique({
//     where: {
//       email: "ppanday064@gmail.com",
//     },
//   });

//   const user2 = await prisma.user.findUnique({
//     where: {
//       email: "ggleboy9@gmail.com",
//     },
//   });

//   const user3 = await prisma.user.findUnique({
//     where: {
//       email: "shyam@gmail.com",
//     },
//   });

//   const user4 = await prisma.user.findUnique({
//     where: { email: "radhika@gmail.com" },
//   });

//   // 3. Create Chat
//   const chat = await prisma.chat.create({
//     data: {
//       isGroup: false,
//       userChats: {
//         create: [{ user: { connect: { id: user1.id } } }, { user: { connect: { id: user2.id } } }],
//       },
//     },
//   });

//   // 4. Send Messages
//   const msg1 = await prisma.message.create({
//     data: {
//       senderId: user1!.id,
//       chatId: chat.id,
//       content: "Hi Simran, ready to chat?",
//     },
//   });

//   const msg2 = await prisma.message.create({
//     data: {
//       senderId: user2!.id,
//       chatId: chat.id,
//       content: "Yes, let’s go!",
//     },
//   });

//   // 5. Update chat with last message
//   await prisma.chat.update({
//     where: { id: chat.id },
//     data: {
//       lastMessageId: msg2.id,
//     },
//   });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(() => prisma.$disconnect());


import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🔥 Cleaning old data (except users/accounts)...");

  // ❌ Delete all messageSeen entries
  await prisma.messageSeen.deleteMany({});

  // ❌ Delete all messages
  await prisma.message.deleteMany({});

  // ❌ Delete all userChats
  await prisma.userChat.deleteMany({});

  // ❌ Delete all chats
  await prisma.chat.deleteMany({});

  console.log("✅ Cleaned old chat data");

  // ✅ Fetch existing users
  const user1 = await prisma.user.findUnique({ where: { email: "ppanday064@gmail.com" } });
  const user2 = await prisma.user.findUnique({ where: { email: "ggleboy9@gmail.com" } });
  const user3 = await prisma.user.findUnique({ where: { email: "shyam@gmail.com" } });
  const user4 = await prisma.user.findUnique({ where: { email: "radhika@gmail.com" } });

  if (!user1 || !user2 || !user3 || !user4) {
    throw new Error("❌ One or more users not found");
  }

  // 🔹 Chat 1: user1 + user2
  const chat1 = await prisma.chat.create({
    data: {
      isGroup: false,
      userChats: {
        create: [{ user: { connect: { id: user1.id } } }, { user: { connect: { id: user2.id } } }],
      },
    },
  });

  const msg1_1 = await prisma.message.create({
    data: { senderId: user1.id, chatId: chat1.id, content: "Hey, what's up?" },
  });
  const msg1_2 = await prisma.message.create({
    data: { senderId: user2.id, chatId: chat1.id, content: "All good! You tell?" },
  });

  await prisma.chat.update({
    where: { id: chat1.id },
    data: { lastMessageId: msg1_2.id },
  });

  // 🔹 Chat 2: user1 + user3
  const chat2 = await prisma.chat.create({
    data: {
      isGroup: false,
      userChats: {
        create: [{ user: { connect: { id: user1.id } } }, { user: { connect: { id: user3.id } } }],
      },
    },
  });

  const msg2_1 = await prisma.message.create({
    data: { senderId: user3.id, chatId: chat2.id, content: "Arey kaha ho?" },
  });
  const msg2_2 = await prisma.message.create({
    data: { senderId: user1.id, chatId: chat2.id, content: "Thoda busy tha yaar" },
  });
  const msg2_3 = await prisma.message.create({
    data: { senderId: user3.id, chatId: chat2.id, content: "Koi baat nahi" },
  });

  await prisma.chat.update({
    where: { id: chat2.id },
    data: { lastMessageId: msg2_3.id },
  });

  // 🔹 Chat 3: Group chat
  const chat3 = await prisma.chat.create({
    data: {
      isGroup: true,
      name: "College Friends",
      userChats: {
        create: [
          { user: { connect: { id: user1.id } } },
          { user: { connect: { id: user2.id } } },
          { user: { connect: { id: user3.id } } },
          { user: { connect: { id: user4.id } } },
        ],
      },
    },
  });

  const msg3_1 = await prisma.message.create({
    data: { senderId: user4.id, chatId: chat3.id, content: "Hello group!" },
  });
  const msg3_2 = await prisma.message.create({
    data: { senderId: user2.id, chatId: chat3.id, content: "What's the plan this weekend?" },
  });
  const msg3_3 = await prisma.message.create({
    data: { senderId: user1.id, chatId: chat3.id, content: "Movie and dinner?" },
  });

  await prisma.chat.update({
    where: { id: chat3.id },
    data: { lastMessageId: msg3_3.id },
  });

  console.log("✅ Dummy chats + messages seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
