"use client";

import type React from "react";

import { apiRequest } from "@/lib/api";

import { useState, useEffect } from "react";
import { Plus, Search, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GroupCard } from "@/components/group-card";
import { useToast } from "@/components/ui/use-toast";

export default function GroupsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    members: "",
  });
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");

        const data = await apiRequest("/groups", {
          token: token || undefined,
        });

        setGroups(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchGroups();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setNewGroup((prev) => ({ ...prev, [id]: value }));
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGroup.name.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const createdGroup = await apiRequest("/groups", {
        method: "POST",
        body: { name: newGroup.name },
        token: token || undefined,
      });

      setGroups((prev) => [createdGroup, ...prev]);
      setNewGroup({ name: "", description: "", members: "" });
      setOpenDialog(false);

      toast({
        title: "Success",
        description: "Group created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  const handleDeleteGroup = (groupId: string) => {
    // Remove the group
    setGroups((prevGroups) =>
      prevGroups.filter((group) => group.id !== groupId),
    );

    // Also remove any expenses associated with this group
    const savedExpenses = localStorage.getItem("splitflow-expenses");
    if (savedExpenses) {
      try {
        const expenses = JSON.parse(savedExpenses);
        const groupName = groups.find((g) => g.id === groupId)?.name;

        if (groupName) {
          const updatedExpenses = expenses.filter(
            (expense: any) => expense.group !== groupName,
          );
          localStorage.setItem(
            "splitflow-expenses",
            JSON.stringify(updatedExpenses),
          );
        }
      } catch (error) {
        console.error("Error updating expenses after group deletion:", error);
      }
    }

    toast({
      title: "Group Deleted",
      description: "The group and its associated expenses have been deleted",
    });
  };

  // Filter groups based on search query
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Create a new group to track shared expenses
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGroup} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Roommates, Trip to Paris, etc."
                  value={newGroup.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What is this group for?"
                  value={newGroup.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="members">Add Members (Optional)</Label>
                <Input
                  id="members"
                  placeholder="Enter email addresses, separated by commas"
                  value={newGroup.members}
                  onChange={handleInputChange}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Create Group</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search groups..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {filteredGroups.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGroups.map((group) => (
                <div key={group.id} className="relative group">
                  <GroupCard group={group} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setGroupToDelete(group.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Group</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this group? This will
                          also remove all expenses associated with this group.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setGroupToDelete(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (groupToDelete) {
                              handleDeleteGroup(groupToDelete);
                              setGroupToDelete(null);
                            }
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Groups Found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? "No groups match your search criteria"
                  : "You don't have any groups yet"}
              </p>
              <Button className="mt-4" onClick={() => setOpenDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Group
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGroups
              .filter((g) => g.activity !== "none")
              .map((group) => (
                <div key={group.id} className="relative group">
                  <GroupCard group={group} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setGroupToDelete(group.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Group</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this group? This will
                          also remove all expenses associated with this group.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setGroupToDelete(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (groupToDelete) {
                              handleDeleteGroup(groupToDelete);
                              setGroupToDelete(null);
                            }
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="archived" className="mt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Archived Groups</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You don't have any archived groups yet
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
