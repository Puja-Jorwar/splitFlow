"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Receipt, Settings, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function GroupPage({ params }: { params: { id: string } }) {
  const [openDialog, setOpenDialog] = useState(false);

  // For demo purposes we'll just show the same data for any ID
  // In a real app, we would fetch this data from an API
  const group = {
    id: params.id,
    name: "Apartment 4B",
    description: "Shared apartment expenses with roommates",
    memberCount: 4,
    totalExpenses: 34,
    totalAmount: 2345.6,
    created: "January 15, 2023",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/groups">
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
            <AddExpenseForm onSuccess={() => setOpenDialog(false)} />
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
                  {group.totalExpenses}
                </span>
              </div>
              <div className="flex flex-col space-y-1.5 rounded-lg border p-4 shadow-sm">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </span>
                <span className="text-2xl font-bold">
                  ${group.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col space-y-1.5 rounded-lg border p-4 shadow-sm">
                <span className="text-sm font-medium text-muted-foreground">
                  Created
                </span>
                <span className="text-2xl font-bold">{group.created}</span>
              </div>
            </div>
            <div className="mt-6">
              <GroupBalanceSummary />
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>People in this group</CardDescription>
          </CardHeader>
          <CardContent>
            <GroupMembersList />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
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
              <ExpensesList />
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
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border p-6 shadow-sm">
                  <h3 className="text-xl font-medium">
                    Simplest way to settle up
                  </h3>
                  <div className="flex items-center gap-3 text-lg">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Jim H." />
                      <AvatarFallback>JH</AvatarFallback>
                    </Avatar>
                    <span>Jim Halpert pays</span>
                    <span className="font-bold text-primary">$128.35</span>
                    <span>to</span>
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="You" />
                      <AvatarFallback>YO</AvatarFallback>
                    </Avatar>
                    <span>You</span>
                  </div>
                  <Button className="mt-2">Record Payment</Button>
                </div>

                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">All balances</h3>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" alt="Jim H." />
                        <AvatarFallback>JH</AvatarFallback>
                      </Avatar>
                      <span>Jim Halpert</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">owes $128.35</span>
                      <span>to</span>
                      <span>You</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" alt="Dwight S." />
                        <AvatarFallback>DS</AvatarFallback>
                      </Avatar>
                      <span>Dwight Schrute</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">gets back $85.20</span>
                      <span>from</span>
                      <span>Pam Beesly</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" alt="You" />
                        <AvatarFallback>YO</AvatarFallback>
                      </Avatar>
                      <span>You</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">gets back $43.15</span>
                      <span>from</span>
                      <span>Pam Beesly</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Recent activity in this group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 border-b pb-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="You" />
                    <AvatarFallback>YO</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      <span className="font-bold">You</span> added an expense:
                      "Grocery shopping"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      April 22, 2023 at 3:45 PM
                    </p>
                  </div>
                  <div className="text-sm font-medium">$120.75</div>
                </div>
                <div className="flex items-start gap-4 border-b pb-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="Jim H." />
                    <AvatarFallback>JH</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      <span className="font-bold">Jim Halpert</span> made a
                      payment to{" "}
                      <span className="font-bold">Dwight Schrute</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      April 20, 2023 at 2:30 PM
                    </p>
                  </div>
                  <div className="text-sm font-medium">$25.00</div>
                </div>
                <div className="flex items-start gap-4 border-b pb-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="Pam B." />
                    <AvatarFallback>PB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      <span className="font-bold">Pam Beesly</span> added an
                      expense: "Internet bill"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      April 10, 2023 at 10:15 AM
                    </p>
                  </div>
                  <div className="text-sm font-medium">$75.00</div>
                </div>
                <div className="flex items-start gap-4 border-b pb-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="You" />
                    <AvatarFallback>YO</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      <span className="font-bold">You</span> added{" "}
                      <span className="font-bold">Dwight Schrute</span> to the
                      group
                    </p>
                    <p className="text-xs text-muted-foreground">
                      April 5, 2023 at 9:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
