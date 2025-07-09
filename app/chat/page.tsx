import { auth } from "@/auth";
import { ChatListPanel } from "@/components/chat/chat-list-panel";
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
    id: "123"

  }

  return (
    <div className="h-screen w-full relative">
      <NavBar user={user} />
      <ChatListPanel />
    </div>
  );
}
