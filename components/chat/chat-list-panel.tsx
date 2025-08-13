"use client";

import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { ChatList } from "./chat-list";
import { ChangeEvent, useState } from "react";
import { AddFriendPanel } from "./add-friend-panel";

export const ChatListPanel = () => {
  const [showAddFriendPanel, setShowAddFriendPanel] = useState(false);
  const [search, setSearch] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

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
            value={search}
            onChange={handleSearch}
            placeholder="Search chats"
            className="rounded-full px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:ring-1"
          />
        </section>

        {/* scroll section */}
        <div className="w-full p-2 flex-1 overflow-hidden">
          {/* Render chats here */}
          <ChatList search={search} />
        </div>
        {/* Add Friend Panel */}
        <AddFriendPanel
          isOpen={showAddFriendPanel}
          onClose={() => setShowAddFriendPanel(false)}
        />
      </aside>
    </>
  );
};
