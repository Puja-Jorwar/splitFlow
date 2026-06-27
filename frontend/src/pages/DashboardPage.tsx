import type React from "react";
import { ArrowRight, DollarSign, Plus, UserRound, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExpensesList } from "@/components/expenses-list";
import { GroupsList } from "@/components/groups-list";
import { BalanceSummary } from "@/components/balance-summary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AddExpenseForm } from "@/components/add-expense-form";
import { apiRequest } from "@/lib/api";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    members: "",
  });
  const [groups, setGroups] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [activeGroups, setActiveGroups] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [youAreOwed, setYouAreOwed] = useState(0);
  const [youOwe, setYouOwe] = useState(0);
  const [categoryData, setCategoryData] = useState<
    { name: string; amount: number }[]
  >([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Helper: Format backend expenses to display format
  const formatExpensesForDisplay = (rawExpenses: any[], currentUserId: string) => {
    return rawExpenses.map((expense) => {
      const mySplit = expense.splits?.find((s: any) => {
        const splitUserId = s.user?._id || s.user;
        return splitUserId === currentUserId;
      });
      const mySplitAmount = mySplit ? mySplit.amount : 0;

      const paidByUserId = expense.paidBy?._id || expense.paidBy;
      const isPaidByMe = paidByUserId === currentUserId;

      const yourShare = isPaidByMe ? (expense.amount - mySplitAmount) : -mySplitAmount;
      const type = isPaidByMe ? "you_paid" : "you_owe";

      return {
        id: expense._id,
        description: expense.description,
        group: expense.group?.name || "Uncategorized",
        date: expense.date,
        paidBy: isPaidByMe ? "You" : (expense.paidBy?.name || "Someone else"),
        amount: expense.amount,
        yourShare: yourShare,
        type: type,
        category: expense.category,
      };
    });
  };

  // Load data from API on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/login");
          return;
        }

        // Fetch User Profile
        const userRes = await apiRequest("/auth/me", { token });
        const user = userRes.user;
        setCurrentUser(user);
        const currentUserId = user._id;

        // Fetch Groups
        const groupsRes = await apiRequest("/groups", { token });
        const fetchedGroups = groupsRes.groups || [];
        setGroups(fetchedGroups);
        setActiveGroups(fetchedGroups.length);

        // Fetch Expenses
        const expensesRes = await apiRequest("/expenses", { token });
        const rawExpenses = expensesRes.expenses || [];
        const formatted = formatExpensesForDisplay(rawExpenses, currentUserId);
        setExpenses(formatted);

        // Calculate metrics
        calculateFinancialSummaries(formatted);
        calculateCategoryData(rawExpenses);
      } catch (error: any) {
        console.error("Dashboard load error:", error);
        toast({
          title: "Error loading dashboard",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    loadDashboardData();
  }, [navigate, toast]);

  // Calculate financial summaries based on expenses
  const calculateFinancialSummaries = (expensesList: any[]) => {
    let totalOwed = 0;
    let totalOwe = 0;

    expensesList.forEach((expense) => {
      if (expense.yourShare > 0) {
        totalOwed += expense.yourShare;
      } else {
        totalOwe += Math.abs(expense.yourShare);
      }
    });

    setYouAreOwed(totalOwed);
    setYouOwe(totalOwe);
    setTotalBalance(totalOwed - totalOwe);
  };

  // Calculate category data for the chart
  const calculateCategoryData = (expensesList: any[]) => {
    const categories: Record<string, number> = {};

    expensesList.forEach((expense) => {
      const category = expense.category || "Uncategorized";
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += expense.amount;
    });

    const categoryArray = Object.entries(categories).map(([name, amount]) => ({
      name,
      amount: Number(amount),
    }));

    setCategoryData(categoryArray);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setNewGroup((prev) => ({ ...prev, [id]: value }));
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGroup.name.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token") || undefined;
      const createdGroup = await apiRequest("/groups", {
        method: "POST",
        body: { name: newGroup.name, description: newGroup.description },
        token,
      });

      // Add members if provided
      if (newGroup.members) {
        const emails = newGroup.members.split(",").map((email) => email.trim());
        for (const email of emails) {
          if (email) {
            try {
              await apiRequest(`/groups/${createdGroup._id}/members`, {
                method: "POST",
                body: { email },
                token,
              });
            } catch (memberErr: any) {
              console.error("Failed to add member:", email, memberErr);
            }
          }
        }
      }

      // Re-fetch groups to ensure accurate details
      const groupsRes = await apiRequest("/groups", { token });
      const fetchedGroups = groupsRes.groups || [];
      setGroups(fetchedGroups);
      setActiveGroups(fetchedGroups.length);

      // Reset form and close dialog
      setNewGroup({ name: "", description: "", members: "" });
      setOpenGroupDialog(false);

      toast({
        title: "Success",
        description: `Group "${newGroup.name}" has been created`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create group",
        variant: "destructive",
      });
    }
  };

  const handleAddExpense = async (expenseData: any) => {
    try {
      const token = localStorage.getItem("token") || undefined;
      const selectedGroupObj = groups.find((g: any) => g.name === expenseData.group);
      if (!selectedGroupObj) {
        throw new Error("Selected group not found");
      }

      const currentUserId = currentUser?._id;
      let paidById = currentUserId;

      if (expenseData.paidBy === "other") {
        const member = selectedGroupObj.members?.find(
          (m: any) => m.name?.toLowerCase() === expenseData.paidByPerson?.toLowerCase()
        );
        if (member) {
          paidById = member._id || member.id;
        }
      }

      await apiRequest("/expenses", {
        method: "POST",
        body: {
          description: expenseData.description,
          amount: parseFloat(expenseData.amount),
          date: expenseData.date,
          category: expenseData.category,
          groupId: selectedGroupObj._id || selectedGroupObj.id,
          paidById,
          splitMethod: expenseData.splitMethod,
          notes: expenseData.notes,
        },
        token,
      });

      // Re-fetch all expenses to refresh calculations
      const expensesRes = await apiRequest("/expenses", { token });
      const rawExpenses = expensesRes.expenses || [];
      const formatted = formatExpensesForDisplay(rawExpenses, currentUserId);
      setExpenses(formatted);

      // Calculate metrics
      calculateFinancialSummaries(formatted);
      calculateCategoryData(rawExpenses);

      // Close dialog and show success message
      setOpenExpenseDialog(false);
      toast({
        title: "Success",
        description: `Expense "${expenseData.description}" has been added`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Dialog open={openGroupDialog} onOpenChange={setOpenGroupDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>
                  Create a new group to track shared expenses
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Roommates, Trip to Paris, etc."
                    value={newGroup.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What is this group for?"
                    value={newGroup.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="members">Add Members (Optional)</Label>
                  <Input
                    id="members"
                    placeholder="Enter email addresses, separated by commas"
                    value={newGroup.members}
                    onChange={handleInputChange}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">Create Group</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={openExpenseDialog} onOpenChange={setOpenExpenseDialog}>
            <DialogTrigger asChild>
              <Button variant="default">
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
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">You Are Owed</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${youAreOwed.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.type === "you_paid").length > 0
                ? `From ${expenses.filter((e) => e.type === "you_paid").length} expenses`
                : "No outstanding payments"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">You Owe</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${youOwe.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.filter((e) => e.type === "you_owe").length > 0
                ? `From ${expenses.filter((e) => e.type === "you_owe").length} expenses`
                : "No outstanding debts"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <UserRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGroups}</div>
            <p className="text-xs text-muted-foreground">
              {activeGroups > 0
                ? `${groups.length} total groups`
                : "No groups created yet"}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>
                Your recent expenses across all groups
              </CardDescription>
            </div>
            <Link
              to="/dashboard/expenses"
              className="ml-auto flex items-center gap-1 text-sm font-medium"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <ExpensesList expenses={expenses.slice(0, 5)} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No expenses yet. Add your first expense to get started.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setOpenExpenseDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Balance Summary</CardTitle>
            <CardDescription>Your current balance with friends</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <BalanceSummary expenses={expenses} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No balances to display yet.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="outline"
              disabled={expenses.length === 0}
            >
              Settle Up
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Your Groups</CardTitle>
            <CardDescription>Groups you participate in</CardDescription>
          </CardHeader>
          <CardContent>
            {groups.length > 0 ? (
              <GroupsList groups={groups.slice(0, 4)} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No groups yet. Create your first group to get started.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setOpenGroupDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              asChild
              variant="ghost"
              className="w-full"
              disabled={groups.length === 0}
            >
              <Link to="/dashboard/groups">View All Groups</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Your expense trends</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                {categoryData.slice(0, 5).map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center">
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="ml-auto text-sm">
                        ${category.amount.toFixed(2)}
                      </div>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        (category.amount /
                          Math.max(...categoryData.map((c) => c.amount))) *
                          100,
                      )}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No spending data to display yet.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              asChild
              variant="ghost"
              className="w-full"
              disabled={expenses.length === 0}
            >
              <Link to="/dashboard/analytics">View Detailed Analysis</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
