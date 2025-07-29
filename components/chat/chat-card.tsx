import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { MessageStatus } from "./message-status";
import { cn } from "@/lib/utils";
import { Chat } from "@/types/chat-types";

interface ChatCardProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export const ChatCard = ({ chat, isActive, onClick }: ChatCardProps) => {
  if(!chat.user) return null;

  return (
    <article
      className={cn("p-2 cursor-pointer hover:bg-muted/50 rounded-md", isActive && "bg-muted hover:bg-muted")}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div>
          <Avatar className="size-12">
            <AvatarImage src={chat.user?.image ?? undefined} />
            <AvatarFallback>{chat.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <Label>{chat.user.name}</Label>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 line-clamp-1">{chat.lastMessage}</p>
            <MessageStatus />
          </div>
        </div>
      </div>
    </article>
  );
};
