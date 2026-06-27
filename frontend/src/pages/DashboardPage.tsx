import type React from "react";
import { ArrowRight, DollarSign, Plus, UserRound, Wallet, ArrowUpRight, ArrowDownRight, Compass } from "lucide-react";
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
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back{currentUser ? `, ${currentUser.name}` : ""}! View your current balance and settlements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={openGroupDialog} onOpenChange={setOpenGroupDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-slate-950/40 border-white/5 backdrop-blur-md rounded-xl hover:bg-white/5 text-slate-300">
                <Plus className="mr-2 h-4 w-4" />
                Add Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Group</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Create a new group to track shared expenses
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-300">Group Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Roommates, Trip to Paris, etc."
                    value={newGroup.name}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-950/40 border-white/5 text-white rounded-xl"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-slate-300">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What is this group for?"
                    value={newGroup.description}
                    onChange={handleInputChange}
                    className="bg-slate-950/40 border-white/5 text-white rounded-xl min-h-[80px]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="members" className="text-slate-300">Add Members (Optional)</Label>
                  <Input
                    id="members"
                    placeholder="Enter email addresses, separated by commas"
                    value={newGroup.members}
                    onChange={handleInputChange}
                    className="bg-slate-950/40 border-white/5 text-white rounded-xl"
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/95 rounded-xl font-bold w-full sm:w-auto">Create Group</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={openExpenseDialog} onOpenChange={setOpenExpenseDialog}>
            <DialogTrigger asChild>
              <Button variant="default" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl font-bold">
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Expense</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Enter the details for your new expense
                </DialogDescription>
              </DialogHeader>
              <AddExpenseForm onSuccess={handleAddExpense} groups={groups} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`glass-panel border-white/5 shadow-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${totalBalance >= 0 ? "glow-success" : "glow-danger"}`}>
          <div className={`absolute top-0 right-0 h-20 w-20 rounded-full blur-2xl pointer-events-none ${totalBalance >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10"}`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Balance</CardTitle>
            <DollarSign className={`h-4.5 w-4.5 ${totalBalance >= 0 ? "text-emerald-400" : "text-rose-400"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-white mt-1">
              ${totalBalance.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              {totalBalance >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Net credit</span> position
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-rose-400" />
                  <span className="text-rose-400 font-semibold">Net debt</span> position
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 shadow-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500/20">
          <div className="absolute top-0 right-0 h-20 w-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">You Are Owed</CardTitle>
            <Wallet className="h-4.5 w-4.5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-white mt-1">
              ${youAreOwed.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {expenses.filter((e) => e.type === "you_paid").length > 0
                ? `From ${expenses.filter((e) => e.type === "you_paid").length} shared items`
                : "No outstanding balances"}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 shadow-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-rose-500/20">
          <div className="absolute top-0 right-0 h-20 w-20 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">You Owe</CardTitle>
            <Wallet className="h-4.5 w-4.5 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-white mt-1">
              ${youOwe.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {expenses.filter((e) => e.type === "you_owe").length > 0
                ? `From ${expenses.filter((e) => e.type === "you_owe").length} shared items`
                : "No pending debts"}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 shadow-lg relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/20">
          <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Groups</CardTitle>
            <UserRound className="h-4.5 w-4.5 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-white mt-1">
              {activeGroups}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {activeGroups > 0
                ? `${groups.length} total shared circles`
                : "Create a group to start splitting"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 glass-panel border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-slate-100/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-1">
              <CardTitle className="text-white font-bold">Recent Expenses</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Your recent expense events across all groups
              </CardDescription>
            </div>
            <Link
              to="/dashboard/expenses"
              className="ml-auto flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <ExpensesList expenses={expenses.slice(0, 5)} />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Compass className="h-10 w-10 text-slate-500 mb-3" />
                <p className="text-sm text-slate-400">
                  No expenses recorded yet. Let's log your first item!
                </p>
                <Button
                  className="mt-5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg shadow-primary/20"
                  onClick={() => setOpenExpenseDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 glass-panel border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-white font-bold">Balance Summary</CardTitle>
            <CardDescription className="text-slate-400 text-xs">Your current balances by participant</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <BalanceSummary expenses={expenses} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-slate-400">
                  No balances to compute yet.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-950 font-bold rounded-xl py-2.5 transition-transform hover:scale-[1.01]"
              variant="default"
              disabled={expenses.length === 0}
            >
              Settle Up
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 glass-panel border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-white font-bold">Your Groups</CardTitle>
            <CardDescription className="text-slate-400 text-xs">Shared groups you participate in</CardDescription>
          </CardHeader>
          <CardContent>
            {groups.length > 0 ? (
              <GroupsList groups={groups.slice(0, 4)} />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-sm text-slate-400">
                  You are not in any groups yet. Let's create a circle!
                </p>
                <Button
                  className="mt-5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg shadow-primary/20"
                  onClick={() => setOpenGroupDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              asChild
              variant="ghost"
              className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-white/5 rounded-xl font-bold py-2"
              disabled={groups.length === 0}
            >
              <Link to="/dashboard/groups">View All Groups</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-3 glass-panel border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-white font-bold">Monthly Spending</CardTitle>
            <CardDescription className="text-slate-400 text-xs">Your top category breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                {categoryData.slice(0, 5).map((category) => (
                  <div key={category.name} className="space-y-1.5">
                    <div className="flex items-center text-sm font-semibold text-slate-200">
                      <div>{category.name}</div>
                      <div className="ml-auto">
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
                      className="h-2 rounded-full bg-slate-950/50"
                      indicatorClassName="bg-gradient-to-r from-indigo-500 to-pink-500"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-slate-400">
                  No spending recorded this month.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              asChild
              variant="ghost"
              className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-white/5 rounded-xl font-bold py-2"
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
