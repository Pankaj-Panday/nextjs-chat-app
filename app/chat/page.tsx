import { auth } from "@/auth";
import { ChatListPanel } from "@/components/chat/chat-list-panel";
import { ChatWindow } from "@/components/chat/chat-window";
import { NavBar } from "@/components/chat/navbar";
import { ChatProvider } from "@/context/chat-context";
import { SocketProvider } from "@/context/socket-context";
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
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const formattedChats = userChats.map((userChat) => {
    const participants = userChat.Chat?.userChats.map(({ user }) => {
      return user;
    });

    return {
      id: userChat.id,
      chatId: userChat.Chat?.id || "",
      isGroup: userChat.Chat?.isGroup,
      name: userChat.Chat?.name,
      lastMessage: userChat.Chat?.lastMessage?.content,
      participants: participants,
      lastRead: userChat.lastRead,
      muted: userChat.muted,
    };
  });

  return (
    <SocketProvider userId={user.id}>
      <div className="h-screen w-full flex flex-col">
        <div>
          <NavBar user={user} />
        </div>
        <div className="flex-1 flex flex-row items-stretch overflow-hidden">
          <ChatProvider initialChats={formattedChats}>
            <ChatListPanel currentUser={user} />
            {/* show this window when there is any active chat */}
            <section className="flex-1 flex flex-col">
              <ChatWindow currentUser={user} />
            </section>
          </ChatProvider>
        </div>
      </div>
    </SocketProvider>
  );
}
