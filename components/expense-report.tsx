"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileDown, Printer, BarChart4, PieChart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ExpenseReport() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("month")
  const [reportType, setReportType] = useState<string>("summary")
  const { toast } = useToast()

  useEffect(() => {
    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem("splitflow-expenses")
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses))
      } catch (error) {
        console.error("Error parsing saved expenses:", error)
      }
    }

    // Load groups from localStorage
    const savedGroups = localStorage.getItem("splitflow-groups")
    if (savedGroups) {
      try {
        setGroups(JSON.parse(savedGroups))
      } catch (error) {
        console.error("Error parsing saved groups:", error)
      }
    }
  }, [])

  // Filter expenses based on selected group and date range
  const filteredExpenses = expenses.filter((expense) => {
    // Group filter
    const matchesGroup = selectedGroup === "all" || expense.group === selectedGroup

    // Date filter
    let matchesDate = true
    const expenseDate = new Date(expense.date)
    const now = new Date()

    if (dateRange === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(now.getMonth() - 1)
      matchesDate = expenseDate >= monthAgo
    } else if (dateRange === "quarter") {
      const quarterAgo = new Date()
      quarterAgo.setMonth(now.getMonth() - 3)
      matchesDate = expenseDate >= quarterAgo
    } else if (dateRange === "year") {
      const yearAgo = new Date()
      yearAgo.setFullYear(now.getFullYear() - 1)
      matchesDate = expenseDate >= yearAgo
    }

    return matchesGroup && matchesDate
  })

  // Calculate summary data
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const youPaidTotal = filteredExpenses
    .filter((expense) => expense.type === "you_paid")
    .reduce((sum, expense) => sum + expense.amount, 0)
  const youOweTotal = filteredExpenses
    .filter((expense) => expense.type === "you_owe")
    .reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate category data
  const categoryData: Record<string, number> = {}
  filteredExpenses.forEach((expense) => {
    const category = expense.category || "Uncategorized"
    if (!categoryData[category]) {
      categoryData[category] = 0
    }
    categoryData[category] += expense.amount
  })

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      toast({
        title: "No Data",
        description: "There are no expenses to export",
        variant: "destructive",
      })
      return
    }

    // Create CSV content
    const headers = ["Date", "Description", "Group", "Category", "Paid By", "Amount", "Your Share"]
    const csvRows = [headers.join(",")]

    filteredExpenses.forEach((expense) => {
      const row = [
        expense.date,
        `"${expense.description}"`, // Quote to handle commas in description
        `"${expense.group}"`,
        expense.category || "Uncategorized",
        `"${expense.paidBy}"`,
        expense.amount.toFixed(2),
        expense.yourShare.toFixed(2),
      ]
      csvRows.push(row.join(","))
    })

    const csvContent = csvRows.join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `expense-report-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "Your expense report has been downloaded as a CSV file",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Card className="print:shadow-none">
      <CardHeader>
        <CardTitle>Expense Report</CardTitle>
        <CardDescription>Generate and export expense reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row print:hidden">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.name}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1 flex justify-end gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <Tabs value={reportType} onValueChange={setReportType} className="print:hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">
              <BarChart4 className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="details">
              <PieChart className="mr-2 h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="print:block">
          <h2 className="text-xl font-bold mb-4 print:block hidden">
            Expense Report - {selectedGroup === "all" ? "All Groups" : selectedGroup}
          </h2>
          <p className="text-sm text-muted-foreground mb-6 print:block hidden">
            {dateRange === "all"
              ? "All Time"
              : dateRange === "month"
                ? "Last Month"
                : dateRange === "quarter"
                  ? "Last 3 Months"
                  : "Last Year"}
          </p>

          {(reportType === "summary" || window.matchMedia("print").matches) && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">{filteredExpenses.length} expenses</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">You Paid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${youPaidTotal.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      {filteredExpenses.filter((e) => e.type === "you_paid").length} expenses
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-medium">You Owe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${youOweTotal.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      {filteredExpenses.filter((e) => e.type === "you_owe").length} expenses
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(categoryData).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(categoryData)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => (
                          <div key={category} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{category}</span>
                              <span className="text-sm font-medium">${amount.toFixed(2)}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${(amount / totalAmount) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">No category data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {(reportType === "details" || window.matchMedia("print").matches) && (
            <Card className="mt-6 print:mt-0 print:border-0 print:shadow-none">
              <CardHeader className="print:px-0">
                <CardTitle>Expense Details</CardTitle>
              </CardHeader>
              <CardContent className="print:px-0">
                {filteredExpenses.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Paid By</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>{expense.group}</TableCell>
                          <TableCell>{expense.category || "Uncategorized"}</TableCell>
                          <TableCell>{expense.paidBy}</TableCell>
                          <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No expenses found for the selected filters</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
