import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Receipt, Settings, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpensesList } from "@/components/expenses-list";
import { GroupMembersList } from "@/components/group-members-list";
import { GroupBalanceSummary } from "@/components/group-balance-summary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddExpenseForm } from "@/components/add-expense-form";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatExpensesForDisplay = (rawExpenses: any[], currentUserId: string, groupName: string) => {
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
        group: groupName,
        date: expense.date,
        paidBy: isPaidByMe ? "You" : (expense.paidBy?.name || "Someone else"),
        amount: expense.amount,
        yourShare: yourShare,
        type: type,
        category: expense.category,
      };
    });
  };

  const loadGroupDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      // User
      const userRes = await apiRequest("/auth/me", { token });
      setCurrentUser(userRes.user);
      const currentUserId = userRes.user._id;

      // Group detail
      const groupRes = await apiRequest(`/groups/${id}`, { token });
      setGroup(groupRes);

      // Balances
      const balancesRes = await apiRequest(`/groups/${id}/balances`, { token });
      setBalances(balancesRes.balances || []);

      // Expenses
      const expensesRes = await apiRequest(`/expenses?groupId=${id}`, { token });
      const formatted = formatExpensesForDisplay(expensesRes.expenses || [], currentUserId, groupRes.name);
      setExpenses(formatted);
    } catch (err: any) {
      toast({
        title: "Error loading group",
        description: err.message || "Failed to fetch details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupDetails();
  }, [id]);

  const handleAddExpense = async (expenseData: any) => {
    try {
      const token = localStorage.getItem("token") || undefined;
      const currentUserId = currentUser?._id;
      let paidById = currentUserId;

      if (expenseData.paidBy === "other") {
        const member = group?.members?.find(
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
          groupId: id,
          paidById,
          splitMethod: expenseData.splitMethod,
          notes: expenseData.notes,
        },
        token,
      });

      // Reload
      await loadGroupDetails();
      setOpenDialog(false);
      toast({
        title: "Success",
        description: `Expense "${expenseData.description}" added successfully`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold">Group not found</h2>
        <p className="text-muted-foreground mt-2">The group you are looking for does not exist or you don't have access.</p>
        <Button className="mt-4" asChild>
          <Link to="/dashboard/groups">Back to Groups</Link>
        </Button>
      </div>
    );
  }

  const createdDate = group.createdAt 
    ? new Date(group.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : "Recently";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/dashboard/groups">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
        <Button variant="outline" size="sm" className="ml-auto gap-1">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense to {group.name}</DialogTitle>
              <DialogDescription>
                Enter the details for your new expense
              </DialogDescription>
            </DialogHeader>
            <AddExpenseForm onSuccess={handleAddExpense} groups={[group]} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Group Summary</CardTitle>
            <CardDescription>Overview of expenses and balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col space-y-1.5 rounded-lg border p-4 shadow-sm">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </span>
                <span className="text-2xl font-bold">
                  {expenses.length}
                </span>
              </div>
              <div className="flex flex-col space-y-1.5 rounded-lg border p-4 shadow-sm">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </span>
                <span className="text-2xl font-bold">
                  ${(group.totalAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col space-y-1.5 rounded-lg border p-4 shadow-sm">
                <span className="text-sm font-medium text-muted-foreground">
                  Created
                </span>
                <span className="text-xl font-bold truncate">{createdDate}</span>
              </div>
            </div>
            <div className="mt-6">
              <GroupBalanceSummary balances={balances} currentUser={currentUser} />
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>People in this group</CardDescription>
          </CardHeader>
          <CardContent>
            <GroupMembersList
              members={group.members}
              groupId={group._id}
              onRefresh={loadGroupDetails}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>All expenses in this group</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="ml-auto gap-1">
                <Receipt className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </CardHeader>
            <CardContent>
              <ExpensesList expenses={expenses} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="balances" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Balances</CardTitle>
              <CardDescription>
                Current balances between all members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GroupBalanceSummary balances={balances} currentUser={currentUser} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
