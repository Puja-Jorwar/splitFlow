"use client";
import { useRouter } from "next/navigation";
import { ReceiptScanner } from "@/components/receipt-scanner";
import { useToast } from "@/components/ui/use-toast";

export default function ReceiptScannerPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleScanComplete = (data: any) => {
    // Get existing expenses
    const savedExpenses = localStorage.getItem("splitflow-expenses");
    let expenses = [];

    if (savedExpenses) {
      try {
        expenses = JSON.parse(savedExpenses);
      } catch (error) {
        console.error("Error parsing saved expenses:", error);
      }
    }

    // Create new expense from scanned data
    const newExpense = {
      id: `expense-${Date.now()}`,
      description: data.description,
      group: data.group || "Uncategorized", // Default group if none selected
      date: data.date || new Date().toISOString().split("T")[0],
      paidBy: "You",
      amount: Number.parseFloat(data.amount),
      yourShare: Number.parseFloat(data.amount) * 0.75, // Simplified: you get back 75% if you paid
      type: "you_paid",
      category: data.category || "Uncategorized",
      notes: data.notes || "",
    };

    // Add to expenses and save
    expenses.unshift(newExpense);
    localStorage.setItem("splitflow-expenses", JSON.stringify(expenses));

    toast({
      title: "Expense Added",
      description: "Your scanned receipt has been added as an expense",
    });

    // Redirect to expenses page
    router.push("/dashboard/expenses");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Receipt Scanner</h1>
      </div>

      <ReceiptScanner onScanComplete={handleScanComplete} />
    </div>
  );
}
