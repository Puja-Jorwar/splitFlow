"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, Home, PieChart, Settings, Users, Plus, Receipt, FileText, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="border-r bg-background h-full flex flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 gap-1 text-sm font-medium">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname === "/dashboard" ? "bg-secondary text-primary" : "text-muted-foreground",
            )}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/expenses"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname.startsWith("/dashboard/expenses") ? "bg-secondary text-primary" : "text-muted-foreground",
            )}
          >
            <Receipt className="h-4 w-4" />
            Expenses
          </Link>
          <Link
            href="/dashboard/groups"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname.startsWith("/dashboard/groups") ? "bg-secondary text-primary" : "text-muted-foreground",
            )}
          >
            <Users className="h-4 w-4" />
            Groups
          </Link>
          <Link
            href="/dashboard/analytics"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname.startsWith("/dashboard/analytics") ? "bg-secondary text-primary" : "text-muted-foreground",
            )}
          >
            <PieChart className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            href="/dashboard/payments"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname.startsWith("/dashboard/payments") ? "bg-secondary text-primary" : "text-muted-foreground",
            )}
          >
            <CreditCard className="h-4 w-4" />
            Payments
          </Link>
          <Link
            href="/dashboard/receipt-scanner"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname.startsWith("/dashboard/receipt-scanner") ? "bg-secondary text-primary" : "text-muted-foreground",
            )}
          >
            <Camera className="h-4 w-4" />
            Receipt Scanner
          </Link>
          <Link
            href="/dashboard/reports"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname.startsWith("/dashboard/reports") ? "bg-secondary text-primary" : "text-muted-foreground",
            )}
          >
            <FileText className="h-4 w-4" />
            Reports
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname.startsWith("/dashboard/settings") ? "bg-secondary text-primary" : "text-muted-foreground",
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>
      <div className="border-t p-4">
        <Button className="w-full" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>
    </div>
  )
}
