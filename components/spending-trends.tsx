"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SpendingTrendsProps {
  timeRange: string
}

export function SpendingTrends({ timeRange }: SpendingTrendsProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Generate mock data based on time range
    const generateData = () => {
      const result = []
      let periods = 12
      let periodName = "Month"

      switch (timeRange) {
        case "week":
          periods = 7
          periodName = "Day"
          break
        case "month":
          periods = 4
          periodName = "Week"
          break
        case "quarter":
          periods = 3
          periodName = "Month"
          break
        case "year":
          periods = 12
          periodName = "Month"
          break
        default:
          periods = 12
          periodName = "Month"
      }

      const categories = ["Groceries", "Restaurants", "Utilities", "Entertainment", "Transportation"]

      for (let i = 0; i < periods; i++) {
        const entry: any = {
          name: `${periodName} ${i + 1}`,
        }

        let total = 0
        categories.forEach((category) => {
          // Generate random values with some trend
          const baseValue = 50 + Math.sin(i / 2) * 30
          const randomFactor = Math.random() * 20 - 10
          const value = Math.max(0, baseValue + randomFactor)

          entry[category] = value
          total += value
        })

        entry.total = total
        result.push(entry)
      }

      return result
    }

    setData(generateData())
  }, [timeRange])

  return (
    <div className="space-y-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              fontSize={12}
              tickMargin={8}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="mb-2 font-bold">{label}</div>
                      <div className="grid gap-1">
                        {payload.map((entry, index) => (
                          <div key={`item-${index}`} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm text-muted-foreground">{entry.name}:</span>
                            <span className="text-sm font-medium">${entry.value.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="Groceries" stackId="a" fill="#4F46E5" />
            <Bar dataKey="Restaurants" stackId="a" fill="#8B5CF6" />
            <Bar dataKey="Utilities" stackId="a" fill="#EC4899" />
            <Bar dataKey="Entertainment" stackId="a" fill="#F59E0B" />
            <Bar dataKey="Transportation" stackId="a" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Spending Insights</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium">Highest Spending Period</div>
            <div className="mt-1 text-2xl font-bold">
              {data.length > 0
                ? data.reduce((max, item) => (item.total > max.total ? item : max), data[0]).name
                : "Loading..."}
            </div>
            <div className="text-sm text-muted-foreground">
              $
              {data.length > 0
                ? data.reduce((max, item) => (item.total > max.total ? item : max), data[0]).total.toFixed(2)
                : "0.00"}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium">Average Monthly Spending</div>
            <div className="mt-1 text-2xl font-bold">
              ${data.length > 0 ? (data.reduce((sum, item) => sum + item.total, 0) / data.length).toFixed(2) : "0.00"}
            </div>
            <div className="text-sm text-muted-foreground">Across {data.length} periods</div>
          </div>
        </div>
      </div>
    </div>
  )
}
