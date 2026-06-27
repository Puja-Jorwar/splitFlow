"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-[#070b19]/85 backdrop-blur-md px-6 text-slate-200">
      <Button variant="outline" size="icon" className="md:hidden border-white/5 bg-slate-950/40 hover:bg-white/5 rounded-xl">
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-slate-950/40 border-white/5 focus:border-primary/50 text-white pl-9 md:w-[300px] lg:w-[400px] rounded-xl h-10"
            />
          </div>
        </form>
      </div>
      <Button variant="outline" size="icon" className="rounded-xl border-white/5 bg-slate-950/40 hover:bg-white/5 text-slate-300">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Notifications</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
