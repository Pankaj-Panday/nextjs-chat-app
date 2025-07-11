import { auth } from "@/auth";
import { ChatListPanel } from "@/components/chat/chat-list-panel";
import { ChatWindow } from "@/components/chat/chat-window";
import { EmptyChatWindow } from "@/components/chat/empty-chat-window";
import { NavBar } from "@/components/chat/navbar";
import { prisma } from "@/lib/prisma";
import { AppUser } from "@/types/user";

export default async function ChatPage() {
  const session = await auth();
  if (!session) return null;

  const user = session.user as AppUser;

  const userChats = await prisma.userChat.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      lastRead: true,
      muted: true,
      Chat: {
        select: {
          id: true,
          isGroup: true,
          name: true,
          lastMessage: {
            select: {
              content: true,
            },
          },
          userChats: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const formattedChats = userChats.map((chat) => {
    return {
      id: chat.id,
      lastRead: chat.lastRead,
      muted: chat.muted,
      content: {},
    };
  });

  return (
    <div className="h-screen w-full flex flex-col">
      <div>
        <NavBar user={user} />
      </div>
      <div className="flex-1 flex flex-row items-stretch overflow-hidden">
        <ChatListPanel chats={userChats} />
        {/* show this window when there is any active chat */}
        <section className="flex-1 flex flex-col">{false ? <ChatWindow /> : <EmptyChatWindow />}</section>
      </div>
    </div>
  );
}
