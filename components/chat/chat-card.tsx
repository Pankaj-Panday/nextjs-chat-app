import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import userImg from "@/demo-data/user.jpeg";
import { Label } from "../ui/label";
import { MessageStatus } from "./message-status";
import { cn } from "@/lib/utils";

export const ChatCard = ({ chat, isActive, onClick }) => {
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
          <Label>User</Label>
          <div className="flex items-center justify-between">
            <p className="text-sm">Hello, how are you ?</p>
            <MessageStatus />
          </div>
        </div>
      </div>
    </article>
  );
};
