"use client";

import { ChangeEvent, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import userImg from "@/demo-data/user.jpeg";
import { AppUser } from "@/types/user";
import { ScrollArea } from "../ui/scroll-area";

interface AddFriendPanelProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export const AddFriendPanel = ({ isOpen, onClose }: AddFriendPanelProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<AppUser[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
            value={searchTerm}
            onChange={handleChange}
          />
          {searchResults.length > 0 && (
            <ScrollArea className="h-full mt-4 pr-3 pb-3">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-3 rounded-md p-3 hover:bg-muted transition cursor-pointer"
                >
                  <Avatar className="size-10">
                    <AvatarImage src={userImg.src} />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-foreground">Pankaj {result.id}</p>
                    <p className="text-xs text-muted-foreground">pankaj@example.com</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
