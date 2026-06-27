"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  onSuccess: () => void;
  groups?: any[];
  currentUser?: any;
}

export function PaymentForm({ onSuccess, groups = [], currentUser }: PaymentFormProps) {
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currentUserId = currentUser?._id;

  // When group changes, update members list
  useEffect(() => {
    if (!selectedGroupId) {
      setGroupMembers([]);
      return;
    }
    const group = groups.find((g) => g._id === selectedGroupId || g.id === selectedGroupId);
    if (group && group.members) {
      // Filter out current user from members
      const otherMembers = group.members.filter(
        (m: any) => (m._id || m.id || m) !== currentUserId
      );
      setGroupMembers(otherMembers);
    } else {
      setGroupMembers([]);
    }
    setSelectedPersonId("");
  }, [selectedGroupId, groups, currentUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !selectedPersonId || !amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await apiRequest("/payments", {
        method: "POST",
        body: {
          groupId: selectedGroupId,
          paidToId: selectedPersonId,
          amount: parseFloat(amount),
          method,
          notes,
        },
        token: token || undefined,
      });

      toast({
        title: "Payment Recorded",
        description: "Your payment has been successfully recorded",
      });
      onSuccess();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to record payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="group">Group</Label>
        <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
          <SelectTrigger id="group">
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((g: any) => (
              <SelectItem key={g._id || g.id} value={g._id || g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="person">Paid To</Label>
        <Select
          value={selectedPersonId}
          onValueChange={setSelectedPersonId}
          disabled={!selectedGroupId}
        >
          <SelectTrigger id="person">
            <SelectValue placeholder={selectedGroupId ? "Select a person" : "Select a group first"} />
          </SelectTrigger>
          <SelectContent>
            {groupMembers.map((m: any) => {
              const name = m.name || "Unknown";
              const initials = name.split(" ").map((n: string) => n[0]).join("");
              return (
                <SelectItem key={m._id || m.id} value={m._id || m.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                  </div>
                </SelectItem>
              );
            })}
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="method">Payment Method</Label>
        <Select value={method} onValueChange={setMethod}>
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
        <Textarea
          id="notes"
          placeholder="Add any additional details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Recording...
            </>
          ) : (
            "Record Payment"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
