"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface GroupBalanceSummaryProps {
  balances?: any[];
  currentUser?: any;
}

export function GroupBalanceSummary({
  balances = [],
  currentUser,
}: GroupBalanceSummaryProps) {
  const currentUserId = currentUser?._id;

  if (balances.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">All balances settled! 🎉</p>
      </div>
    );
  }

  const formattedBalances = balances.map((bal: any, index: number) => {
    const fromUser = bal.from;
    const toUser = bal.to;
    const amount = bal.amount;

    const fromName = fromUser?._id === currentUserId ? "You" : (fromUser?.name || "Unknown");
    const toName = toUser?._id === currentUserId ? "You" : (toUser?.name || "Unknown");

    const initials = fromUser?.name
      ? fromUser.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
      : "?";

    return {
      id: index,
      fromName,
      toName,
      amount,
      initials,
    };
  });

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Current Balances</h3>
      <div className="grid gap-4">
        {formattedBalances.map((bal) => (
          <div key={bal.id} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{bal.initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{bal.fromName} owes {bal.toName}</span>
            </div>
            <div className="text-red-600 font-medium">${bal.amount.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
