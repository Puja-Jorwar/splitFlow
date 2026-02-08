"use client";

import { useAuth } from "@/hooks/useAuth";

import type { ReactNode } from "react";
// import { DashboardSidebar } from "@/components/dashboard-sidebar"
// import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useAuth();

  return (
    <div className="min-h-screen p-6 text-white">
      <h1>Layout OK</h1>

      {/* <DashboardSidebar /> */}
      {/* <DashboardHeader /> */}

      <main>{children}</main>
    </div>
  );
}
