import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticsChart } from "@/components/analytics-chart";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { SpendingTrends } from "@/components/spending-trends";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Sparkles, PieChart as PieChartIcon } from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze your spending patterns and trends across all groups
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-slate-950/40 border-white/5 backdrop-blur-md">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="bg-slate-950/40 border-white/5 backdrop-blur-md">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download data</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-950/50 border border-white/5 p-1 rounded-xl backdrop-blur-md">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground">Categories</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground">Trends</TabsTrigger>
          <TabsTrigger value="groups" className="rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground">Groups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 outline-none">
          <Card className="glass-panel border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                Expense Overview
              </CardTitle>
              <CardDescription>
                Your spending patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <AnalyticsChart timeRange={timeRange} />
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-panel border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-pink-400" />
                  Top Categories
                </CardTitle>
                <CardDescription>Where you spend the most</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown />
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  Group Spending
                </CardTitle>
                <CardDescription>Expenses by group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Apartment 4B", desc: "Shared apartment expenses", amount: 845.50, color: "text-indigo-400 bg-indigo-500/10" },
                    { name: "Trip to NYC", desc: "Weekend trip expenses", amount: 625.75, color: "text-emerald-400 bg-emerald-500/10" },
                    { name: "Office Lunch Group", desc: "Weekly lunches", amount: 284.50, color: "text-amber-400 bg-amber-500/10" },
                    { name: "Family Shared Bills", desc: "Family subscriptions", amount: 156.35, color: "text-rose-400 bg-rose-500/10" },
                  ].map((group) => (
                    <div key={group.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${group.color}`}>
                          {group.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium leading-none">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{group.desc}</p>
                        </div>
                      </div>
                      <div className="font-bold text-sm">${group.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="outline-none">
          <Card className="glass-panel border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>
                Detailed view of your spending by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBreakdown detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="outline-none">
          <Card className="glass-panel border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>
                How your spending has changed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpendingTrends timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="outline-none">
          <Card className="glass-panel border-white/5 shadow-2xl">
            <CardHeader>
              <CardTitle>Group Analysis</CardTitle>
              <CardDescription>
                Spending patterns across your groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  { name: "Apartment 4B", total: 845.50, share: 211.38, topCat: "Utilities" },
                  { name: "Trip to NYC", total: 625.75, share: 104.29, topCat: "Dining" },
                ].map((group) => (
                  <div key={group.name} className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                    <h3 className="text-lg font-bold mb-4">{group.name}</h3>
                    <div className="h-[200px]">
                      <AnalyticsChart timeRange={timeRange} simplified />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div className="rounded-xl border border-white/5 bg-slate-950/20 p-3">
                        <div className="text-xs font-medium text-muted-foreground">Total Spent</div>
                        <div className="text-xl font-extrabold mt-1 text-slate-100">${group.total.toFixed(2)}</div>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-slate-950/20 p-3">
                        <div className="text-xs font-medium text-muted-foreground">Your Share</div>
                        <div className="text-xl font-extrabold mt-1 text-primary-foreground">${group.share.toFixed(2)}</div>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-slate-950/20 p-3">
                        <div className="text-xs font-medium text-muted-foreground">Top Category</div>
                        <div className="text-xl font-extrabold mt-1 text-indigo-400">{group.topCat}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
