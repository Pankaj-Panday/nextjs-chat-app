"use client";

import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { ChatList } from "./chat-list";

export const ChatListPanel = () => {
  return (
    <aside className="w-96 border-r pt-16 absolute left-0 top-0 bottom-0">
      <section className="flex gap-2 flex-col p-2">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Chats</h2>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition">
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
      <div className="w-full p-2">
        {/* Render chats here */}
        <ChatList />
      </div>
    </aside>
  );
};
