import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <DashboardSidebar />
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
