import { FileText, Download, Calendar, TrendingUp, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const REPORT_SUMMARIES = [
  { label: "Total Expenses (YTD)", value: "$4,820.50", icon: DollarSign, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { label: "Groups Tracked", value: "6", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Avg. Monthly Spend", value: "$401.70", icon: TrendingUp, color: "text-pink-400", bg: "bg-pink-500/10" },
  { label: "Months of Data", value: "12", icon: Calendar, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const MOCK_REPORT_ROWS = [
  { period: "June 2026", expenses: 24, total: "$920.75", settled: "$720.50", outstanding: "$200.25" },
  { period: "May 2026", expenses: 19, total: "$740.10", settled: "$740.10", outstanding: "$0.00" },
  { period: "April 2026", expenses: 31, total: "$1,102.30", settled: "$1,000.00", outstanding: "$102.30" },
  { period: "March 2026", expenses: 16, total: "$614.20", settled: "$614.20", outstanding: "$0.00" },
  { period: "February 2026", expenses: 22, total: "$831.00", settled: "$600.00", outstanding: "$231.00" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Reports</h1>
          <p className="text-sm text-slate-400 mt-1">Expense history and financial summaries across all groups.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/15 h-9 px-4 text-sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {REPORT_SUMMARIES.map((s) => (
          <Card key={s.label} className="glass-panel border-white/[0.06] metric-card">
            <CardContent className="p-5">
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${s.bg}`}>
                <s.icon className={`h-4.5 w-4.5 ${s.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Table */}
      <Card className="glass-panel border-white/[0.06]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            Monthly Expense Reports
          </CardTitle>
          <CardDescription className="text-slate-400">
            Summary of expenses, settlements, and outstanding balances per month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Period", "Expenses", "Total Amount", "Settled", "Outstanding"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider first:pl-0 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {MOCK_REPORT_ROWS.map((row) => (
                  <tr key={row.period} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-4 font-semibold text-white first:pl-0">{row.period}</td>
                    <td className="py-4 px-4 text-slate-400">{row.expenses} items</td>
                    <td className="py-4 px-4 text-white font-medium">{row.total}</td>
                    <td className="py-4 px-4 text-emerald-400 font-medium">{row.settled}</td>
                    <td className="py-4 px-4 last:pr-0">
                      <span className={`font-semibold ${row.outstanding === "$0.00" ? "text-slate-500" : "text-rose-400"}`}>
                        {row.outstanding}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
