"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import userImg from "@/demo-data/user.jpeg";

interface AddFriendPanelProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export const AddFriendPanel = ({ isOpen, onClose }: AddFriendPanelProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-96">
        <SheetHeader>
          <SheetTitle>Find Contact</SheetTitle>
          <SheetDescription>Search your contact</SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <Input
            type="search"
            placeholder="Search by email"
            className="py-6 px-4 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:opacity-70"
          />
          <div className="mt-4">
            <div className="flex items-center gap-3 rounded-md p-3 hover:bg-muted transition cursor-pointer">
              <Avatar className="size-10">
                <AvatarImage src={userImg.src} />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">Pankaj</p>
                <p className="text-xs text-muted-foreground">pankaj@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
