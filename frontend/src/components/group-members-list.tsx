"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { apiRequest } from "@/lib/api";

interface GroupMembersListProps {
  members?: any[];
  groupId?: string;
  onRefresh?: () => void;
}

export function GroupMembersList({
  members = [],
  groupId,
  onRefresh,
}: GroupMembersListProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !groupId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await apiRequest(`/groups/${groupId}/members`, {
        method: "POST",
        body: { email },
        token: token || undefined,
      });

      toast({
        title: "Success",
        description: `Member ${email} added successfully`,
      });
      setEmail("");
      setOpen(false);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formattedMembers = members.map((member: any) => {
    const initials = member.name
      ? member.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
      : "?";

    return {
      id: member._id || member.id,
      name: member.name || "Unknown",
      email: member.email || "",
      avatar: "/placeholder.svg",
      initials,
      role: "Member", // default
    };
  });

  return (
    <div className="space-y-4">
      {formattedMembers.length > 0 ? (
        formattedMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">
                  {member.email}
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">{member.role}</div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground text-center py-2">
          No members found
        </p>
      )}

      {groupId && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Add Group Member</DialogTitle>
              <DialogDescription>
                Invite a friend by their email address to join this group.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Member"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
