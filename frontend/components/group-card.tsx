import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    activity: string;
    balance: number;
    balanceType: string;
    lastActivity: string;
    transactions: number;
  };
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{group.name}</CardTitle>
          <Badge
            variant={
              group.activity === "high"
                ? "default"
                : group.activity === "medium"
                  ? "outline"
                  : "secondary"
            }
          >
            {group.memberCount} members
          </Badge>
        </div>
        <CardDescription>{group.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last Activity</span>
            <span className="text-sm">{group.lastActivity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Transactions</span>
            <span className="text-sm">{group.transactions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span
              className={`text-sm font-medium ${
                group.balanceType === "positive"
                  ? "text-green-600"
                  : group.balanceType === "negative"
                    ? "text-red-600"
                    : ""
              }`}
            >
              {group.balanceType === "positive" && "+"}
              {group.balanceType === "negative" && "-"}
              {group.balanceType !== "neutral"
                ? `$${Math.abs(group.balance).toFixed(2)}`
                : "Settled up"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link href={`/dashboard/groups/${group.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
