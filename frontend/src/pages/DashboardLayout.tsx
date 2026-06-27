import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout() {
  useAuth();

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-[#070b19] overflow-hidden">
      <div className="hidden border-r border-white/5 md:block h-screen">
        <DashboardSidebar />
      </div>
      <div className="flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>


  );
}
