"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

interface BalanceSummaryProps {
  expenses?: any[];
}

export function BalanceSummary({
  expenses: propExpenses,
}: BalanceSummaryProps) {
  const [balances, setBalances] = useState<any[]>([]);

  useEffect(() => {
    // Calculate balances from expenses
    const calculateBalances = (expenses: any[]) => {
      // Group by payer and calculate totals
      const balanceMap: Record<string, { amount: number; group: string }> = {};

      expenses.forEach((expense) => {
        if (expense.paidBy !== "You" && expense.type === "you_owe") {
          // You owe this person
          if (!balanceMap[expense.paidBy]) {
            balanceMap[expense.paidBy] = { amount: 0, group: expense.group };
          }
          balanceMap[expense.paidBy].amount -= Math.abs(expense.yourShare);
        } else if (expense.paidBy === "You" && expense.type === "you_paid") {
          // This is a simplification - in a real app, you'd track who owes what
          // For now, we'll create a generic "Friend" entry for demonstration
          const friendName = `Friend from ${expense.group}`;
          if (!balanceMap[friendName]) {
            balanceMap[friendName] = { amount: 0, group: expense.group };
          }
          balanceMap[friendName].amount += Math.abs(expense.yourShare);
        }
      });

      // Convert to array and sort by amount
      return Object.entries(balanceMap)
        .map(([name, data]) => ({
          name,
          group: data.group,
          amount: data.amount,
        }))
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    };

    if (propExpenses && propExpenses.length > 0) {
      setBalances(calculateBalances(propExpenses));
    } else {
      // Load expenses from localStorage if not provided as props
      const savedExpenses = localStorage.getItem("splitflow-expenses");
      if (savedExpenses) {
        try {
          const parsedExpenses = JSON.parse(savedExpenses);
          setBalances(calculateBalances(parsedExpenses));
        } catch (error) {
          console.error("Error parsing saved expenses:", error);
          setBalances([]);
        }
      }
    }
  }, [propExpenses]);

  if (balances.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">No balances to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {balances.map((balance, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={balance.name} />
            <AvatarFallback>
              {balance.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm font-medium">{balance.name}</div>
            <div className="text-xs text-muted-foreground">{balance.group}</div>
          </div>
          <div
            className={`text-sm font-medium ${balance.amount > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {balance.amount > 0 ? "+" : ""}
            {balance.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
