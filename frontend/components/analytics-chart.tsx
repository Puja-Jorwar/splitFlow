"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AnalyticsChartProps {
  timeRange: string
  simplified?: boolean
}

export function AnalyticsChart({ timeRange, simplified = false }: AnalyticsChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Generate mock data based on time range
    const generateData = () => {
      const result = []
      let days = 30

      switch (timeRange) {
        case "week":
          days = 7
          break
        case "month":
          days = 30
          break
        case "quarter":
          days = 90
          break
        case "year":
          days = 365
          break
        default:
          days = 30
      }

      // For simplified view, use fewer data points
      const step = simplified ? Math.max(Math.floor(days / 10), 1) : 1

      for (let i = 0; i < days; i += step) {
        const date = new Date()
        date.setDate(date.getDate() - (days - i))

        // Generate random values with some trend
        const baseValue = 50 + Math.sin(i / 10) * 30
        const randomFactor = Math.random() * 20 - 10

        result.push({
          date: date.toISOString().split("T")[0],
          expenses: Math.max(0, baseValue + randomFactor),
          average: baseValue,
        })
      }

      return result
    }

    setData(generateData())
  }, [timeRange, simplified])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            const date = new Date(value)
            if (timeRange === "week" || simplified) {
              return date.toLocaleDateString(undefined, { weekday: "short" })
            } else if (timeRange === "month") {
              return date.toLocaleDateString(undefined, { day: "numeric" })
            } else if (timeRange === "quarter") {
              return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
            } else {
              return date.toLocaleDateString(undefined, { month: "short" })
            }
          }}
          fontSize={12}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} fontSize={12} tickMargin={8} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                      <span className="font-bold text-muted-foreground">
                        {new Date(payload[0].payload.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Expenses</span>
                      <span className="font-bold">${payload[0].value.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "var(--primary)", opacity: 0.8 },
          }}
          style={{
            stroke: "var(--primary)",
          }}
        />
        {!simplified && (
          <Line
            type="monotone"
            dataKey="average"
            strokeWidth={1}
            strokeDasharray="4 4"
            style={{
              stroke: "var(--muted-foreground)",
              opacity: 0.8,
            }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
