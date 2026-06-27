"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export function DashboardHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("TOKEN CLEARED");
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-[#070b19]/85 backdrop-blur-md px-6 text-slate-200">
      {/* Mobile Sidebar Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden border-white/5 bg-slate-950/40 hover:bg-white/5 rounded-xl">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[240px] border-r border-white/5 bg-[#070b19] text-slate-200">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <form onSubmit={(e) => e.preventDefault()}>
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
              <AvatarFallback className="bg-primary/20 text-slate-200">JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white rounded-xl">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="border-white/5" />
          <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="hover:bg-white/5 cursor-pointer">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="hover:bg-white/5 cursor-pointer">
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-white/5" />
          <DropdownMenuItem onClick={handleLogout} className="text-rose-400 hover:bg-rose-500/10 focus:text-rose-400 cursor-pointer">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
