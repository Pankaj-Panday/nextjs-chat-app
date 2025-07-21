"use client";

import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { ChatList } from "./chat-list";
import { useState } from "react";
import { AddFriendPanel } from "./add-friend-panel";
import { AppUser } from "@/types/user";

interface ChatListPanelProps {
  currentUser: AppUser;
}

export const ChatListPanel = ({ currentUser }: ChatListPanelProps) => {
  const [showAddFriendPanel, setShowAddFriendPanel] = useState(false);

  return (
    <>
      <aside className="w-96 shrink-0 border-r flex flex-col">
        <section className="flex gap-2 flex-col p-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Chats</h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted transition"
              onClick={() => setShowAddFriendPanel((prev) => !prev)}
            >
              <Plus className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          {/* Search input */}
          <Input
            type="search"
            placeholder="Search chats"
            className="rounded-full px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:ring-1"
          />
        </section>

        {/* scroll section */}
        <div className="w-full p-2 flex-1 overflow-hidden">
          {/* Render chats here */}
          <ChatList currentUser={currentUser} />
        </div>
        {/* Add Friend Panel */}
        <AddFriendPanel currentUser={currentUser} isOpen={showAddFriendPanel} onClose={() => setShowAddFriendPanel(false)} />
      </aside>
    </>
  );
};
