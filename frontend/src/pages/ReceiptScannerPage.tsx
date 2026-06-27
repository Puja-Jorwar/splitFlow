import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptScanner } from "@/components/receipt-scanner";
import { useToast } from "@/components/ui/use-toast";
import { apiRequest } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ReceiptScannerPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/login");
          return;
        }

        // Fetch User
        const userRes = await apiRequest("/auth/me", { token });
        setCurrentUser(userRes.user);

        // Fetch Groups
        const groupsRes = await apiRequest("/groups", { token });
        const fetchedGroups = groupsRes.groups || [];
        setGroups(fetchedGroups);
        if (fetchedGroups.length > 0) {
          setSelectedGroupId(fetchedGroups[0]._id || fetchedGroups[0].id);
        }
      } catch (error: any) {
        toast({
          title: "Error loading groups",
          description: error.message || "Failed to fetch groups",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitData();
  }, [navigate, toast]);

  const handleScanComplete = async (data: any) => {
    if (!selectedGroupId) {
      toast({
        title: "Error",
        description: "Please select a group first",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token") || undefined;
      const currentUserId = currentUser?._id;

      await apiRequest("/expenses", {
        method: "POST",
        body: {
          description: data.description,
          amount: parseFloat(data.amount),
          date: data.date,
          category: data.category || "Other",
          groupId: selectedGroupId,
          paidById: currentUserId,
          splitMethod: "equal",
          notes: data.notes,
        },
        token,
      });

      toast({
        title: "Expense Added",
        description: `Your scanned receipt for "${data.description}" has been added successfully`,
      });

      navigate("/dashboard/expenses");
    } catch (error: any) {
      toast({
        title: "Error adding expense",
        description: error.message || "Failed to add scanned receipt",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Loading setup...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Receipt Scanner</h1>
      </div>

      <Card className="p-4">
        <CardContent className="space-y-4 pt-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="group-select">Select Group to Assign Expense</Label>
            {groups.length > 0 ? (
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger id="group-select" className="w-full">
                  <SelectValue placeholder="Select a Group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group._id || group.id} value={group._id || group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-red-500 font-medium">
                You must be part of at least one group to scan and assign receipts. Please create a group first.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <ReceiptScanner onScanComplete={handleScanComplete} />
    </div>
  );
}
