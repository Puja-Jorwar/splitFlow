"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PaymentForm } from "@/components/payment-form"

export default function PaymentsPage() {
  const [openDialog, setOpenDialog] = useState(false)

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
              <DialogDescription>Record a payment you made or received</DialogDescription>
            </DialogHeader>
            <PaymentForm onSuccess={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,245.60</div>
            <p className="text-xs text-muted-foreground">+$350.75 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$876.25</div>
            <p className="text-xs text-muted-foreground">+$125.50 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">UPI, PayPal, Bank Transfer</p>
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
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Jim H." />
                      <AvatarFallback>JH</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Jim Halpert</p>
                      <p className="text-sm text-muted-foreground">Apr 22, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">UPI</Badge>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$128.35</p>
                      <p className="text-xs text-muted-foreground">Apartment 4B</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Pam B." />
                      <AvatarFallback>PB</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Pam Beesly</p>
                      <p className="text-sm text-muted-foreground">Apr 18, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">PayPal</Badge>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$43.15</p>
                      <p className="text-xs text-muted-foreground">Trip to NYC</p>
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
                      <p className="font-medium">You paid Dwight Schrute</p>
                      <p className="text-sm text-muted-foreground">Apr 15, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">Bank Transfer</Badge>
                    <div className="text-right">
                      <p className="font-medium text-red-600">-$85.20</p>
                      <p className="text-xs text-muted-foreground">Cabin Weekend</p>
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
                      <p className="font-medium">You paid Michael Scott</p>
                      <p className="text-sm text-muted-foreground">Apr 10, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">UPI</Badge>
                    <div className="text-right">
                      <p className="font-medium text-red-600">-$56.75</p>
                      <p className="text-xs text-muted-foreground">Office Lunch Group</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Angela M." />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Angela Martin</p>
                      <p className="text-sm text-muted-foreground">Apr 5, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">PayPal</Badge>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$89.43</p>
                      <p className="text-xs text-muted-foreground">Office Expenses</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>Payments that need to be made or received</CardDescription>
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
                      <p className="text-sm text-muted-foreground">Due in 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      Remind
                    </Button>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$67.50</p>
                      <p className="text-xs text-muted-foreground">Office Lunch Group</p>
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
                      <p className="text-sm text-muted-foreground">Due in 5 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button size="sm">Pay Now</Button>
                    <div className="text-right">
                      <p className="font-medium text-red-600">-$42.25</p>
                      <p className="text-xs text-muted-foreground">Trip to NYC</p>
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
                      <p className="text-sm text-muted-foreground">Due in 7 days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      Remind
                    </Button>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+$35.80</p>
                      <p className="text-xs text-muted-foreground">Office Expenses</p>
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
                    <Badge variant="outline" className="bg-green-50 text-green-600">
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
                      <p className="text-sm text-muted-foreground">user@example.com</p>
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
                      <p className="text-sm text-muted-foreground">XXXX-XXXX-1234</p>
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
    </div>
  )
}
