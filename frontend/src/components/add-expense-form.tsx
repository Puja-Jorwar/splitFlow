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
    <form onSubmit={handleSubmit} className="space-y-4 pt-3">
      {/* Description & Amount Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="grid gap-1.5 col-span-2">
          <Label htmlFor="description" className="text-slate-300 text-xs font-semibold">Description</Label>
          <Input
            id="description"
            placeholder="Dinner, Groceries, etc."
            value={formData.description}
            onChange={handleChange}
            required
            className="bg-slate-950/40 border-white/5 text-white rounded-xl h-10"
          />
        </div>

        <div className="grid gap-1.5 col-span-1">
          <Label htmlFor="amount" className="text-slate-300 text-xs font-semibold">Amount</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-sm">
              $
            </span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              className="pl-7 bg-slate-950/40 border-white/5 text-white rounded-xl h-10"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Group & Category Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="group" className="text-slate-300 text-xs font-semibold">Group</Label>
          <Select
            value={formData.group}
            onValueChange={(value) => handleSelectChange("group", value)}
          >
            <SelectTrigger id="group" className="bg-slate-950/40 border-white/5 text-white rounded-xl h-10">
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
              {uniqueGroups.length > 0 ? (
                uniqueGroups.map((groupName) => (
                  <SelectItem key={groupName} value={groupName} className="hover:bg-white/5 focus:bg-white/5">
                    {groupName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="default" disabled>Create a group first</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="category" className="text-slate-300 text-xs font-semibold">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger id="category" className="bg-slate-950/40 border-white/5 text-white rounded-xl h-10">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
              {EXPENSE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category} className="hover:bg-white/5 focus:bg-white/5">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date & Paid By Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="date" className="text-slate-300 text-xs font-semibold">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-slate-950/40 border-white/5 text-white rounded-xl h-10 hover:bg-white/5 hover:text-white",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10 rounded-xl">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="bg-slate-900 text-white border-none rounded-xl"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-1.5">
          <Label className="text-slate-300 text-xs font-semibold">Paid by</Label>
          <RadioGroup
            value={formData.paidBy}
            onValueChange={(value) => handleSelectChange("paidBy", value)}
            className="flex flex-row gap-4 h-10 items-center"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="you" id="you" className="border-slate-500 text-primary" />
              <Label htmlFor="you" className="text-slate-300 text-sm font-normal cursor-pointer">You</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" className="border-slate-500 text-primary" />
              <Label htmlFor="other" className="text-slate-300 text-sm font-normal cursor-pointer">Someone else</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Conditional Paid By Person Input */}
      {formData.paidBy === "other" && (
        <div className="grid gap-1.5">
          <Label htmlFor="paidByPerson" className="text-slate-300 text-xs font-semibold">Who paid?</Label>
          <Input
            id="paidByPerson"
            placeholder="Enter member's name"
            value={formData.paidByPerson}
            onChange={handleChange}
            required={formData.paidBy === "other"}
            className="bg-slate-950/40 border-white/5 text-white rounded-xl h-10"
          />
        </div>
      )}

      {/* Split Method */}
      <div className="grid gap-1.5">
        <Label className="text-slate-300 text-xs font-semibold">Split Method</Label>
        <RadioGroup
          value={formData.splitMethod}
          onValueChange={(value) => handleSelectChange("splitMethod", value)}
          className="flex flex-row gap-4 h-10 items-center"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="equal" id="equal" className="border-slate-500 text-primary" />
            <Label htmlFor="equal" className="text-slate-300 text-sm font-normal cursor-pointer">Equal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unequal" id="unequal" className="border-slate-500 text-primary" />
            <Label htmlFor="unequal" className="text-slate-300 text-sm font-normal cursor-pointer">Unequal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="percentage" className="border-slate-500 text-primary" />
            <Label htmlFor="percentage" className="text-slate-300 text-sm font-normal cursor-pointer">Percentage</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Notes (Optional) */}
      <div className="grid gap-1.5">
        <Label htmlFor="notes" className="text-slate-300 text-xs font-semibold">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional details..."
          value={formData.notes}
          onChange={handleChange}
          className="bg-slate-950/40 border-white/5 text-white rounded-xl min-h-[60px] max-h-[100px] resize-none"
        />
      </div>

      <DialogFooter className="pt-2">
        <Button type="submit" className="bg-primary hover:bg-primary/95 text-white rounded-xl font-bold w-full h-11">
          Create Expense
        </Button>
      </DialogFooter>
    </form>
  );
}
