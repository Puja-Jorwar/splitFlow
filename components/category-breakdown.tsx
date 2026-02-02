"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Progress } from "@/components/ui/progress"

interface CategoryBreakdownProps {
  detailed?: boolean
}

export function CategoryBreakdown({ detailed = false }: CategoryBreakdownProps) {
  const data = [
    { name: "Groceries", value: 430.82, color: "#4F46E5" },
    { name: "Restaurants", value: 284.5, color: "#8B5CF6" },
    { name: "Utilities", value: 156.35, color: "#EC4899" },
    { name: "Entertainment", value: 122.41, color: "#F59E0B" },
    { name: "Transportation", value: 89.7, color: "#10B981" },
    { name: "Shopping", value: 76.25, color: "#3B82F6" },
    { name: "Other", value: 45.3, color: "#6B7280" },
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-4">
      {detailed ? (
        <div className="space-y-4">
          {data.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <div className="text-sm font-medium">{category.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">${category.value.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{((category.value / total) * 100).toFixed(1)}%</div>
                </div>
              </div>
              <Progress
                value={(category.value / total) * 100}
                className="h-2"
                indicatorClassName={`bg-[${category.color}]`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Category</span>
                            <span className="font-bold text-muted-foreground">{payload[0].name}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Amount</span>
                            <span className="font-bold">${payload[0].value.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {data.slice(0, 4).map((category) => (
          <div
            key={category.name}
            className="flex flex-col items-center justify-center rounded-lg border p-3 text-center"
          >
            <div className="mb-2 h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
            <div className="text-sm font-medium">{category.name}</div>
            <div className="text-xs text-muted-foreground">${category.value.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
