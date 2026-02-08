"use client";

import type React from "react";

import { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const [paymentType, setPaymentType] = useState("paid");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would submit to an API here
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label>Payment Type</Label>
        <RadioGroup
          value={paymentType}
          onValueChange={setPaymentType}
          className="flex"
        >
          <div className="flex items-center space-x-2 mr-4">
            <RadioGroupItem value="paid" id="paid" />
            <Label htmlFor="paid">I paid</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="received" id="received" />
            <Label htmlFor="received">I received</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="person">
          {paymentType === "paid" ? "Paid to" : "Received from"}
        </Label>
        <Select>
          <SelectTrigger id="person">
            <SelectValue placeholder="Select a person" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jim">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" alt="Jim H." />
                  <AvatarFallback>JH</AvatarFallback>
                </Avatar>
                <span>Jim Halpert</span>
              </div>
            </SelectItem>
            <SelectItem value="pam">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" alt="Pam B." />
                  <AvatarFallback>PB</AvatarFallback>
                </Avatar>
                <span>Pam Beesly</span>
              </div>
            </SelectItem>
            <SelectItem value="dwight">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" alt="Dwight S." />
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
                <span>Dwight Schrute</span>
              </div>
            </SelectItem>
            <SelectItem value="michael">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" alt="Michael S." />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <span>Michael Scott</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            $
          </span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            className="pl-7"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="group">Group</Label>
        <Select>
          <SelectTrigger id="group">
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartment">Apartment 4B</SelectItem>
            <SelectItem value="trip">Trip to NYC</SelectItem>
            <SelectItem value="office">Office Lunch Group</SelectItem>
            <SelectItem value="family">Family Shared Bills</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="method">Payment Method</Label>
        <Select defaultValue="upi">
          <SelectTrigger id="method">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea id="notes" placeholder="Add any additional details..." />
      </div>

      <DialogFooter>
        <Button type="submit">Record Payment</Button>
      </DialogFooter>
    </form>
  );
}
