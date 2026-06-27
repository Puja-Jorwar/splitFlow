"use client";

import { Link, useLocation } from "react-router-dom";
import {
  CreditCard,
  Home,
  PieChart,
  Settings,
  Users,
  Plus,
  Receipt,
  FileText,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function DashboardSidebar() {
  const { pathname } = useLocation();

  return (
    <div className="border-r border-white/5 bg-[#070b19] h-full flex flex-col text-slate-300">
      <div className="flex h-16 items-center border-b border-white/5 px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 gap-1.5 text-sm font-semibold">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
              pathname === "/dashboard"
                ? "bg-primary/20 text-white border border-primary/20"
                : "text-slate-400 hover:text-white hover:bg-white/5",
            )}
          >
            <Home className="h-4.5 w-4.5" />
            Dashboard
          </Link>
          <Link
            to="/dashboard/expenses"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
              pathname.startsWith("/dashboard/expenses")
                ? "bg-primary/20 text-white border border-primary/20"
                : "text-slate-400 hover:text-white hover:bg-white/5",
            )}
          >
            <Receipt className="h-4.5 w-4.5" />
            Expenses
          </Link>
          <Link
            to="/dashboard/groups"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
              pathname.startsWith("/dashboard/groups")
                ? "bg-primary/20 text-white border border-primary/20"
                : "text-slate-400 hover:text-white hover:bg-white/5",
            )}
          >
            <Users className="h-4.5 w-4.5" />
            Groups
          </Link>
          <Link
            to="/dashboard/analytics"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
              pathname.startsWith("/dashboard/analytics")
                ? "bg-primary/20 text-white border border-primary/20"
                : "text-slate-400 hover:text-white hover:bg-white/5",
            )}
          >
            <PieChart className="h-4.5 w-4.5" />
            Analytics
          </Link>
          <Link
            to="/dashboard/payments"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
              pathname.startsWith("/dashboard/payments")
                ? "bg-primary/20 text-white border border-primary/20"
                : "text-slate-400 hover:text-white hover:bg-white/5",
            )}
          >
            <CreditCard className="h-4.5 w-4.5" />
            Payments
          </Link>
          <Link
            to="/dashboard/receipt-scanner"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
              pathname.startsWith("/dashboard/receipt-scanner")
                ? "bg-primary/20 text-white border border-primary/20"
                : "text-slate-400 hover:text-white hover:bg-white/5",
            )}
          >
            <Camera className="h-4.5 w-4.5" />
            Receipt Scanner
          </Link>
          <Link
            to="/dashboard/reports"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
              pathname.startsWith("/dashboard/reports")
                ? "bg-primary/20 text-white border border-primary/20"
                : "text-slate-400 hover:text-white hover:bg-white/5",
            )}
          >
            <FileText className="h-4.5 w-4.5" />
            Reports
          </Link>
          <Link
            to="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
              pathname.startsWith("/dashboard/settings")
                ? "bg-primary/20 text-white border border-primary/20"
                : "text-slate-400 hover:text-white hover:bg-white/5",
            )}
          >
            <Settings className="h-4.5 w-4.5" />
            Settings
          </Link>
        </nav>
      </div>
      <div className="border-t border-white/5 p-4">
        <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold rounded-xl py-2.5 shadow-lg shadow-primary/20" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>
    </div>

  );
}
