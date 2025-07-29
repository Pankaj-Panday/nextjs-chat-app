import { auth } from "@/auth";
import { ChatListPanel } from "@/components/chat/chat-list-panel";
import { ChatWindow } from "@/components/chat/chat-window";
import { NavBar } from "@/components/chat/navbar";
import { ChatProvider } from "@/context/chat-context";
import { SocketProvider } from "@/context/socket-context";
import { prisma } from "@/lib/prisma";

export default async function ChatPage() {
  const session = await auth();
  if (!session) return null;

  const user = session.user;

  const chats = await prisma.chat.findMany({
    where: {
      userChats: {
        some: {
          userId: user.id,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      isGroup: true,
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
          lastRead: true,
          muted: true,
        },
      },
    },
  });

  const formattedChats = chats.map((chat) => {
    const userChat = chat.userChats.find((uc) => uc.user.id === user.id);
    const isMuted = userChat?.muted;
    const lastRead = userChat?.lastRead;

    const otherUsers = chat.userChats.map((uc) => uc.user).filter((u) => u.id !== user.id);

    return {
      id: chat.id,
      name: chat.name,
      isGroup: chat.isGroup,
      lastMessage: chat.lastMessage?.content,
      lastRead,
      muted: isMuted,
      user: !chat.isGroup ? otherUsers[0] : null,
      participants: chat.isGroup ? otherUsers : undefined,
    };
  });

  console.log("New Formatted chats", formattedChats);

  return (
    <SocketProvider userId={user.id}>
      <div className="h-screen w-full flex flex-col">
        <div>
          <NavBar user={user} />
        </div>
        <div className="flex-1 flex flex-row items-stretch overflow-hidden">
          <ChatProvider currentUser={user} initialChats={formattedChats}>
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
