import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
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

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/dashboard/expenses", icon: Receipt, label: "Expenses" },
  { to: "/dashboard/groups", icon: Users, label: "Groups" },
  { to: "/dashboard/analytics", icon: PieChart, label: "Analytics" },
  { to: "/dashboard/payments", icon: CreditCard, label: "Payments" },
  { to: "/dashboard/receipt-scanner", icon: Camera, label: "Receipt Scanner" },
  { to: "/dashboard/reports", icon: FileText, label: "Reports" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  return (
    <div className="flex flex-col h-full bg-[#030712] border-r border-white/[0.06]">
      {/* Logo */}
      <div className="flex h-16 items-center px-5 border-b border-white/[0.06] shrink-0">
        <Link to="/dashboard" className="hover:opacity-90 transition-opacity">
          <Logo size="sm" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => {
          const active = isActive(to, exact);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "nav-active"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-indigo-400" : "text-slate-600")} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="p-4 border-t border-white/[0.06] shrink-0">
        <Button
          onClick={() => navigate("/dashboard?add-expense=true")}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl h-10 text-sm shadow-lg shadow-indigo-500/15 transition-all duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>
    </div>
  );
}
