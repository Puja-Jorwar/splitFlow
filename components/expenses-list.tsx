"use client"

import { CalendarIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ExpensesListProps {
  expenses?: any[]
}

export function ExpensesList({ expenses: propExpenses }: ExpensesListProps) {
  const [displayExpenses, setDisplayExpenses] = useState<any[]>([])

  useEffect(() => {
    if (propExpenses && propExpenses.length > 0) {
      // Convert the flat expense structure to the format needed for display
      const formattedExpenses = propExpenses.map((expense) => ({
        id: expense.id,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        group: expense.group,
        paidBy: {
          name: expense.paidBy,
          avatar: "/placeholder.svg",
          initials:
            expense.paidBy === "You"
              ? "YO"
              : expense.paidBy
                  .split(" ")
                  .map((n: string) => n[0])
                  .join(""),
        },
        type: expense.type,
      }))

      setDisplayExpenses(formattedExpenses)
    } else {
      // Load expenses from localStorage if not provided as props
      const savedExpenses = localStorage.getItem("splitflow-expenses")
      if (savedExpenses) {
        try {
          const parsedExpenses = JSON.parse(savedExpenses)

          // Convert the flat expense structure to the format needed for display
          const formattedExpenses = parsedExpenses.map((expense: any) => ({
            id: expense.id,
            amount: expense.amount,
            description: expense.description,
            date: expense.date,
            group: expense.group,
            paidBy: {
              name: expense.paidBy,
              avatar: "/placeholder.svg",
              initials:
                expense.paidBy === "You"
                  ? "YO"
                  : expense.paidBy
                      .split(" ")
                      .map((n: string) => n[0])
                      .join(""),
            },
            type: expense.type,
          }))

          setDisplayExpenses(formattedExpenses)
        } catch (error) {
          console.error("Error parsing saved expenses:", error)
          setDisplayExpenses([])
        }
      } else {
        setDisplayExpenses([])
      }
    }
  }, [propExpenses])

  if (displayExpenses.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">No expenses to display</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {displayExpenses.map((expense) => (
        <div key={expense.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={expense.paidBy.avatar || "/placeholder.svg"} alt={expense.paidBy.name} />
            <AvatarFallback>{expense.paidBy.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{expense.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{expense.group}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {new Date(expense.date).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className={cn("ml-auto font-medium", expense.type === "you_paid" ? "text-green-600" : "text-red-600")}>
            {expense.type === "you_paid" ? "+" : "-"}${expense.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}
