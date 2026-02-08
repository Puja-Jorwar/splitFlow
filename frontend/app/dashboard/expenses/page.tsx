"use client";

import { useState, useEffect } from "react";
import { Plus, SearchIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddExpenseForm } from "@/components/add-expense-form";
import { useToast } from "@/components/ui/use-toast";

export default function ExpensesPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const { toast } = useToast();

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("splitflow-expenses");
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error("Error parsing saved expenses:", error);
        setExpenses([]);
      }
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("splitflow-expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Load groups for the dropdown
  const [groups, setGroups] = useState<any[]>([]);
  useEffect(() => {
    const savedGroups = localStorage.getItem("splitflow-groups");
    if (savedGroups) {
      try {
        setGroups(JSON.parse(savedGroups));
      } catch (error) {
        console.error("Error parsing saved groups:", error);
      }
    }
  }, []);

  const handleAddExpense = (expenseData: any) => {
    const newExpense = {
      id: `expense-${Date.now()}`,
      description: expenseData.description,
      group: expenseData.group,
      date: expenseData.date || new Date().toISOString().split("T")[0],
      paidBy:
        expenseData.paidBy === "you"
          ? "You"
          : expenseData.paidByPerson || "You",
      amount: Number.parseFloat(expenseData.amount),
      yourShare:
        expenseData.paidBy === "you"
          ? Number.parseFloat(expenseData.amount) * 0.75 // Simplified: you get back 75% if you paid
          : Number.parseFloat(expenseData.amount) * -0.25, // Simplified: you owe 25% if someone else paid
      type: expenseData.paidBy === "you" ? "you_paid" : "you_owe",
    };

    // Add new expense to the list
    setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);

    // Close dialog and show success message
    setOpenDialog(false);
    toast({
      title: "Success",
      description: `Expense "${expenseData.description}" has been added`,
    });
  };

  // Filter expenses based on search query, group filter, and date filter
  const filteredExpenses = expenses.filter((expense) => {
    // Search filter
    const matchesSearch =
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.paidBy.toLowerCase().includes(searchQuery.toLowerCase());

    // Group filter
    const matchesGroup = groupFilter === "all" || expense.group === groupFilter;

    // Date filter (simplified)
    let matchesDate = true;
    const expenseDate = new Date(expense.date);
    const now = new Date();

    if (dateFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      matchesDate = expenseDate >= monthAgo;
    } else if (dateFilter === "quarter") {
      const quarterAgo = new Date();
      quarterAgo.setMonth(now.getMonth() - 3);
      matchesDate = expenseDate >= quarterAgo;
    } else if (dateFilter === "year") {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      matchesDate = expenseDate >= yearAgo;
    }

    return matchesSearch && matchesGroup && matchesDate;
  });

  // Filter expenses by type for different tabs
  const youPaidExpenses = filteredExpenses.filter(
    (expense) => expense.type === "you_paid",
  );
  const youOweExpenses = filteredExpenses.filter(
    (expense) => expense.type === "you_owe",
  );

  // Get unique group names for the filter dropdown
  const uniqueGroups = Array.from(new Set(expenses.map((e) => e.group)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Enter the details for your new expense
              </DialogDescription>
            </DialogHeader>
            <AddExpenseForm onSuccess={handleAddExpense} groups={groups} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative md:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search expenses..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-1 items-center gap-4">
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {uniqueGroups.map((groupName) => (
                <SelectItem key={groupName} value={groupName}>
                  {groupName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="you-paid">You Paid</TabsTrigger>
          <TabsTrigger value="you-owe">You Owe</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>
                View and manage all your expenses across groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredExpenses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Paid By</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Your Share</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.description}
                        </TableCell>
                        <TableCell>{expense.group}</TableCell>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{expense.paidBy}</TableCell>
                        <TableCell className="text-right">
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${expense.yourShare > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {expense.yourShare > 0 ? "+" : ""}$
                          {Math.abs(expense.yourShare).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <SearchIcon className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    No Expenses Found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery ||
                    groupFilter !== "all" ||
                    dateFilter !== "all"
                      ? "No expenses match your search criteria"
                      : "You don't have any expenses yet"}
                  </p>
                  <Button className="mt-4" onClick={() => setOpenDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Expense
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="you-paid" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expenses You Paid</CardTitle>
              <CardDescription>
                Expenses where you paid and others owe you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {youPaidExpenses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">You're Owed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {youPaidExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.description}
                        </TableCell>
                        <TableCell>{expense.group}</TableCell>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          +${Math.abs(expense.yourShare).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <SearchIcon className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    No Expenses Found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven't paid for any expenses that match your criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="you-owe" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expenses You Owe</CardTitle>
              <CardDescription>
                Expenses where others paid and you owe money
              </CardDescription>
            </CardHeader>
            <CardContent>
              {youOweExpenses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Paid By</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                      <TableHead className="text-right">You Owe</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {youOweExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.description}
                        </TableCell>
                        <TableCell>{expense.group}</TableCell>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{expense.paidBy}</TableCell>
                        <TableCell className="text-right">
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          -${Math.abs(expense.yourShare).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <SearchIcon className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">
                    No Expenses Found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don't owe money for any expenses that match your
                    criteria
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
