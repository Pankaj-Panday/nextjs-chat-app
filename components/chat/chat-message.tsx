import { cn } from "@/lib/utils";
import { Message } from "@/types/chat-types";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

export const ChatMessage = ({ message, isOwn }: ChatMessageProps) => {
  const renderMessage = () => {
    switch (message.type) {
      case "TEXT":
        return (
          <div
            className={cn(
              "px-4 py-2 shadow-sm rounded-xl text-sm max-w-[75%] w-fit",
              isOwn
                ? "bg-green-500 text-primary-foreground rounded-br-none"
                : "bg-muted text-muted-foreground rounded-bl-none"
            )}
          >
            {message.content}
          </div>
        );
      case "IMAGE":
        return (
          <Dialog>
            <DialogTrigger asChild>
              <div
                className={cn(
                  "p-2 rounded-xl shadow-sm cursor-pointer w-fit max-w-[75%] transition hover:opacity-90",
                  isOwn ? "bg-green-500 rounded-br-none" : "bg-muted rounded-bl-none"
                )}
              >
                {message.mediaUrl ? (
                  <Image
                    src={message.mediaUrl}
                    alt="image"
                    width={240}
                    height={240}
                    className="rounded-md object-cover"
                  />
                ) : null}
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 w-auto bg-transparent border-none ">
              {message.mediaUrl && (
                <Image
                  src={message.mediaUrl}
                  alt="image"
                  width={800}
                  height={800}
                  className="h-auto w-full rounded-lg object-contain max-h-[80vh]"
                />
              )}
            </DialogContent>
          </Dialog>
        );
    }
  };
  return <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>{renderMessage()}</div>;
};
