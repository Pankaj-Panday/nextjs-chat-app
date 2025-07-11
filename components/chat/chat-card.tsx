import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import userImg from "@/demo-data/user.jpeg";
import { Label } from "../ui/label";
import { MessageStatus } from "./message-status";
import { cn } from "@/lib/utils";
import { ChatListItem } from "@/types/chat-types";

interface ChatCardProps {
  chat: ChatListItem;
  isActive: boolean;
  onClick: (id: string) => void;
}

export const ChatCard = ({ chat, isActive, onClick }: ChatCardProps) => {
  const handleClick = () => {
    onClick(chat.id);
  };

  return (
    <article
      className={cn("p-2 cursor-pointer hover:bg-muted/50 rounded-md", isActive && "bg-muted hover:bg-muted")}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div>
          <Avatar className="size-12">
            <AvatarImage src={userImg.src} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <Label>{chat.Chat.name}</Label>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">{chat.Chat.lastMessage?.content}</p>
            <MessageStatus />
          </div>
        </div>
      </div>
    </article>
  );
};
