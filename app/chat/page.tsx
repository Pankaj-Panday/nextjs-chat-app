import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-btn";

export default async function ChatPage() {
  const session = await auth();
  if (!session) return null;

  const { user } = session;

  return (
    <div>
      <p>{user.name} logged in</p>

      <LogoutButton />
    </div>
  );
}
