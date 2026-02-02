"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnalyticsChart } from "@/components/analytics-chart"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { SpendingTrends } from "@/components/spending-trends"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download data</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Overview</CardTitle>
              <CardDescription>Your spending patterns over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <AnalyticsChart timeRange={timeRange} />
            </CardContent>
          </Card>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>Where you spend the most</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Group Spending</CardTitle>
                <CardDescription>Expenses by group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Apartment 4B</p>
                      <p className="text-sm text-muted-foreground">Shared apartment expenses</p>
                    </div>
                    <div className="font-medium">$845.50</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Trip to NYC</p>
                      <p className="text-sm text-muted-foreground">Weekend trip expenses</p>
                    </div>
                    <div className="font-medium">$625.75</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Office Lunch Group</p>
                      <p className="text-sm text-muted-foreground">Weekly lunches</p>
                    </div>
                    <div className="font-medium">$284.50</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Family Shared Bills</p>
                      <p className="text-sm text-muted-foreground">Family subscriptions</p>
                    </div>
                    <div className="font-medium">$156.35</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Detailed view of your spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBreakdown detailed />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>How your spending has changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingTrends timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="groups" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Group Analysis</CardTitle>
              <CardDescription>Spending patterns across your groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Apartment 4B</h3>
                  <div className="h-[200px]">
                    <AnalyticsChart timeRange={timeRange} simplified />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-muted-foreground">Total Spent</div>
                      <div className="text-2xl font-bold">$845.50</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-muted-foreground">Your Share</div>
                      <div className="text-2xl font-bold">$211.38</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-muted-foreground">Top Category</div>
                      <div className="text-2xl font-bold">Utilities</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Trip to NYC</h3>
                  <div className="h-[200px]">
                    <AnalyticsChart timeRange={timeRange} simplified />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-muted-foreground">Total Spent</div>
                      <div className="text-2xl font-bold">$625.75</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-muted-foreground">Your Share</div>
                      <div className="text-2xl font-bold">$104.29</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium text-muted-foreground">Top Category</div>
                      <div className="text-2xl font-bold">Dining</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
