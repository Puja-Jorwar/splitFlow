"use client";

import { DialogFooter } from "@/components/ui/dialog";

import type React from "react";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddExpenseFormProps {
  onSuccess: (data: any) => void;
  groups?: any[];
}

// Expense categories
const EXPENSE_CATEGORIES = [
  "Groceries",
  "Dining",
  "Utilities",
  "Rent",
  "Transportation",
  "Entertainment",
  "Travel",
  "Shopping",
  "Healthcare",
  "Education",
  "Other",
];

export function AddExpenseForm({
  onSuccess,
  groups = [],
}: AddExpenseFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    group: "",
    paidBy: "you",
    paidByPerson: "",
    splitMethod: "equal",
    category: "Other",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.description.trim()) {
      alert("Please enter a description");
      return;
    }

    if (
      !formData.amount ||
      isNaN(Number.parseFloat(formData.amount)) ||
      Number.parseFloat(formData.amount) <= 0
    ) {
      alert("Please enter a valid amount");
      return;
    }

    if (!formData.group) {
      alert("Please select a group");
      return;
    }

    // Submit the form data
    onSuccess({
      ...formData,
      date: date
        ? format(date, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
    });
  };

  // Get unique group names
  const uniqueGroups = Array.from(new Set(groups.map((g) => g.name)));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Dinner, Groceries, etc."
          value={formData.description}
          onChange={handleChange}
          required
        />
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
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="group">Group</Label>
        <Select
          value={formData.group}
          onValueChange={(value) => handleSelectChange("group", value)}
        >
          <SelectTrigger id="group">
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            {uniqueGroups.length > 0 ? (
              uniqueGroups.map((groupName) => (
                <SelectItem key={groupName} value={groupName}>
                  {groupName}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="default">Create a group first</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleSelectChange("category", value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Paid by</Label>
        <RadioGroup
          value={formData.paidBy}
          onValueChange={(value) => handleSelectChange("paidBy", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="you" id="you" />
            <Label htmlFor="you">You</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Someone else</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.paidBy === "other" && (
        <div className="grid gap-2">
          <Label htmlFor="paidByPerson">Who paid?</Label>
          <Input
            id="paidByPerson"
            placeholder="Enter name"
            value={formData.paidByPerson}
            onChange={handleChange}
            required={formData.paidBy === "other"}
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label>Split Method</Label>
        <RadioGroup
          value={formData.splitMethod}
          onValueChange={(value) => handleSelectChange("splitMethod", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="equal" id="equal" />
            <Label htmlFor="equal">Equal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unequal" id="unequal" />
            <Label htmlFor="unequal">Unequal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="percentage" />
            <Label htmlFor="percentage">By percentage</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional details..."
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <DialogFooter>
        <Button type="submit">Create Expense</Button>
      </DialogFooter>
    </form>
  );
}
