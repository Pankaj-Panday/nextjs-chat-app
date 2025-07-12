import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { MessageStatus } from "./message-status";
import { cn, getChatReceiver } from "@/lib/utils";
import { ChatItem } from "@/types/chat-types";
import { AppUser } from "@/types/user";

interface ChatCardProps {
  chat: ChatItem;
  isActive: boolean;
  onClick: (id: string) => void;
  currentUser: AppUser;
}

export const ChatCard = ({ chat, isActive, onClick, currentUser }: ChatCardProps) => {
  if (!chat.participants) {
    return null;
  }

  const handleClick = () => {
    onClick(chat.chatId);
  };

  const reciever = chat.isGroup ? {name: "Group", image: ""}: getChatReceiver(chat.participants, currentUser);
  return (
    <article
      className={cn("p-2 cursor-pointer hover:bg-muted/50 rounded-md", isActive && "bg-muted hover:bg-muted")}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div>
          <Avatar className="size-12">
            <AvatarImage src={reciever?.image || ""} />
            <AvatarFallback>{reciever?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <Label>{reciever?.name}</Label>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">{chat.lastMessage}</p>
            <MessageStatus />
          </div>
        </div>
      </div>
    </article>
  );
};
