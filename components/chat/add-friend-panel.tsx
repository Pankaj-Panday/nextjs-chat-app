"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { AppUser } from "@/types/user";
import { ScrollArea } from "../ui/scroll-area";
import { getUsersBySearchTerm } from "@/actions/search-actions";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/chat-context";

interface AddFriendPanelProps {
  isOpen: boolean;
  currentUser: AppUser;
  onClose: () => void;
}

export const AddFriendPanel = ({ currentUser, isOpen, onClose }: AddFriendPanelProps) => {
  const [search, setSearch] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debouncedSearch = useDebounce(search);
  const { setActiveChatUser, setActiveChatId, chats } = useChat();

  const handleClick = (user: AppUser) => {
    // if user clicked on himself do nothing
    if(user.id === currentUser.id) return;

    // find if some chat already exist between selected user
    const existingChat = chats.find(chat => {
      return !chat.isGroup && chat.participants?.some(p => p.id === user.id);
    })

    if(existingChat) setActiveChatId(existingChat.chatId);
    else setActiveChatId(null);
    setActiveChatUser(user);
    setSearch("");
    // close the sheet
    onClose();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearch.trim() !== "") {
        setIsLoading(true);
        const users = await getUsersBySearchTerm(debouncedSearch);
        setSearchedUsers(users);
        setIsLoading(false);
      } else {
        setSearchedUsers([]);
      }
    };
    fetchUsers();
  }, [debouncedSearch]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-96">
        <SheetHeader>
          <SheetTitle>Find Contact</SheetTitle>
          <SheetDescription>Search your contact</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-16 h-full overflow-hidden">
          <Input
            type="search"
            placeholder="Search by name or email"
            className="py-6 px-4 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:opacity-70"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isLoading ? (
            <p className="text-muted-foreground text-sm text-center mt-4">Searching...</p>
          ) : searchedUsers.length > 0 ? (
            <ScrollArea className="h-full pr-3 pb-3 mt-4">
              {searchedUsers.map((user) => {
                const isCurrentUser = user.id === currentUser.id;
                return (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center gap-3 rounded-md p-3 hover:bg-muted transition cursor-pointer",
                      isCurrentUser
                        ? "opacity-75 cursor-not-allowed pointer-events-none"
                        : "hover:bg-muted cursor-pointer"
                    )}
                    onClick={() => handleClick(user)}
                  >
                    <Avatar className="size-10">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                        {isCurrentUser && " (You)"}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          ) : debouncedSearch.trim() !== "" ? (
            <p className="text-muted-foreground text-sm text-center mt-4">No users found.</p>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
};
