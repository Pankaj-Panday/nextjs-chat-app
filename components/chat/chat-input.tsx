import { ImageIcon, Plus, SendHorizonal } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChangeEvent, FormEvent, useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface ChatInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onSend: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onImageUpload: (file: File) => Promise<void>;
  loading: boolean;
}

export const ChatInput = ({ message, setMessage, onSend, onImageUpload, loading }: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    await onImageUpload(file);
  };

  return (
    <form onSubmit={onSend} className="flex items-center gap-2 border rounded-full px-3 py-2 mt-2">
      {/* File Input (hidden) */}
      <input type="file" accept="image/*" ref={fileInputRef} hidden onChange={handleFileChange} />

      {/* Attachment Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={loading} className="rounded-full" variant="ghost">
            <Plus className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="mb-2">
          <DropdownMenuItem
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <ImageIcon className="mr-1 h-4 w-4" />
            <span>Image</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Text input */}
      <Input
        autoFocus
        autoComplete="off"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        disabled={loading}
        placeholder="Type a message"
        className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      {/* Send button */}
      <Button type="submit" size="icon" className="rounded-full" disabled={loading}>
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-muted-foreground" />
        ) : (
          <SendHorizonal />
        )}
      </Button>
    </form>
  );
};
