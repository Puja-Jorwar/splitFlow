"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentForm } from "@/components/payment-form";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function PaymentsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [payments, setPayments] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadPaymentsData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Current User
      const userRes = await apiRequest("/auth/me", { token });
      setCurrentUser(userRes.user);

      // Summary
      const summaryRes = await apiRequest("/payments/summary", { token });
      setTotalPaid(summaryRes.totalPaid || 0);
      setTotalReceived(summaryRes.totalReceived || 0);

      // Payments list
      const paymentsRes = await apiRequest("/payments", { token });
      setPayments(paymentsRes.payments || []);

      // Groups list
      const groupsRes = await apiRequest("/groups", { token });
      setGroups(groupsRes.groups || []);
    } catch (error: any) {
      toast({
        title: "Error loading payments",
        description: error.message || "Failed to fetch details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentsData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Record a Payment</DialogTitle>
              <DialogDescription>
                Record a payment you made or received
              </DialogDescription>
            </DialogHeader>
            <PaymentForm
              onSuccess={() => {
                setOpenDialog(false);
                loadPaymentsData();
              }}
              groups={groups}
              currentUser={currentUser}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Across all shared groups
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Received
                </CardTitle>
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalReceived.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Across all shared groups
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Payment Methods
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  UPI, PayPal, Bank, Cash
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="history">
            <TabsList>
              <TabsTrigger value="history">Payment History</TabsTrigger>
              <TabsTrigger value="pending">Pending Payments</TabsTrigger>
              <TabsTrigger value="methods">Payment Methods</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Record of all your payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {payments.length > 0 ? (
                      payments.map((payment: any) => {
                        const currentUserId = currentUser?._id;
                        const isPayerMe = payment.paidBy?._id === currentUserId || payment.paidBy === currentUserId;
                        const displayUser = isPayerMe ? payment.paidTo : payment.paidBy;
                        const displayName = displayUser?.name || "Someone";
                        const initials = displayName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .substring(0, 2);

                        return (
                          <div key={payment._id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {isPayerMe ? `You paid ${displayName}` : `${displayName} paid You`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(payment.createdAt || payment.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant="outline">{payment.method?.toUpperCase()}</Badge>
                              <div className="text-right">
                                <p className={`font-medium ${isPayerMe ? "text-red-600" : "text-green-600"}`}>
                                  {isPayerMe ? "-" : "+"}${payment.amount.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {payment.group?.name || "Uncategorized"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No payments recorded yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>
                Payments that need to be made or received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Kelly K." />
                      <AvatarFallback>KK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Kelly Kapoor</p>
                      <p className="text-sm text-muted-foreground">
                        Due in 3 days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      Remind
                    </Button>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$67.50</p>
                      <p className="text-xs text-muted-foreground">
                        Office Lunch Group
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="You" />
                      <AvatarFallback>YO</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">You owe Ryan Howard</p>
                      <p className="text-sm text-muted-foreground">
                        Due in 5 days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button size="sm">Pay Now</Button>
                    <div className="text-right">
                      <p className="font-medium text-red-600">-$42.25</p>
                      <p className="text-xs text-muted-foreground">
                        Trip to NYC
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Stanley H." />
                      <AvatarFallback>SH</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Stanley Hudson</p>
                      <p className="text-sm text-muted-foreground">
                        Due in 7 days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      Remind
                    </Button>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$35.80</p>
                      <p className="text-xs text-muted-foreground">
                        Office Expenses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="methods" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">UPI</p>
                      <p className="text-sm text-muted-foreground">user@upi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-600"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Default
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-blue-600"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-gray-600"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                        <line x1="2" x2="22" y1="10" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">
                        XXXX-XXXX-1234
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )}
</div>
  );
}
