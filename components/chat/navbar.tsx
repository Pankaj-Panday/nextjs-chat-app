"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "../auth/logout-btn";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import type { AppUser } from "@/types/user";

export const NavBar = ({ user }: { user: AppUser }) => {
  return (
    <nav className="border-b py-2 w-full bg-gray-50 h-16 flex items-center top-0 sticky z-10">
      <div className="flex items-center justify-between px-2 flex-1">
        <div className="flex items-end gap-2">
          {/* Logged in user - Avatar */}
          <Avatar className="size-10">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Username */}
          <div className="leading-tight">
            <p className="font-semibold text-base text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Logout button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              {/* vertical three dot icon */}
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

