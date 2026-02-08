"use client";

import { ExpenseReport } from "@/components/expense-report";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Expense Reports</h1>
      </div>

      <ExpenseReport />
    </div>
  );
}
