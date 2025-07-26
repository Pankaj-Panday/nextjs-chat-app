import { cn } from "@/lib/utils";
import { Message } from "@/types/chat-types";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

export const ChatMessage = ({ message, isOwn }: ChatMessageProps) => {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "px-4 py-2 rounded-xl text-sm max-w-[75%] w-fit",
          isOwn
            ? "bg-green-500 text-primary-foreground rounded-br-none"
            : "bg-muted text-muted-foreground rounded-bl-none"
        )}
      >
        {message.content}
      </div>
    </div>
  );
};
