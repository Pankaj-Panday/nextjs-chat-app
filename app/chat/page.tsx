import { auth } from "@/auth";
import { ChatListPanel } from "@/components/chat/chat-list-panel";
import { ChatWindow } from "@/components/chat/chat-window";
import { EmptyChatWindow } from "@/components/chat/empty-chat-window";
import { NavBar } from "@/components/chat/navbar";
import { AppUser } from "@/types/user";

export default async function ChatPage() {
  // const session = await auth();
  // if (!session) return null;

  // const user = session.user as AppUser;

  const user: AppUser = {
    email: "lsfdsdf",
    name: "aldfdsf",
    image: "salkdf",
    id: "123",
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div>
        <NavBar user={user} />
      </div>
      <div className="flex-1 flex flex-row items-stretch overflow-hidden">
        <ChatListPanel />
        {/* show this window when there is any active chat */}
        <section className="flex-1 flex flex-col">{false ? <ChatWindow /> : <EmptyChatWindow />}</section>
      </div>
    </div>
  );
}
