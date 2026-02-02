"use client"

import { Users } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface GroupsListProps {
  groups?: any[]
}

export function GroupsList({ groups: propGroups }: GroupsListProps) {
  const [displayGroups, setDisplayGroups] = useState<any[]>([])

  useEffect(() => {
    if (propGroups && propGroups.length > 0) {
      setDisplayGroups(propGroups)
    } else {
      // Load groups from localStorage if not provided as props
      const savedGroups = localStorage.getItem("splitflow-groups")
      if (savedGroups) {
        try {
          setDisplayGroups(JSON.parse(savedGroups))
        } catch (error) {
          console.error("Error parsing saved groups:", error)
          setDisplayGroups([])
        }
      } else {
        setDisplayGroups([])
      }
    }
  }, [propGroups])

  if (displayGroups.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">No groups to display</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayGroups.map((group) => (
        <div key={group.id} className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <p className="text-sm font-medium leading-none">{group.name}</p>
              <Badge variant="outline" className="ml-2 px-1.5 py-0 text-[10px]">
                {group.memberCount} members
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{group.description}</p>
          </div>
          <div
            className={`text-sm font-medium ${
              group.balanceType === "positive"
                ? "text-green-600"
                : group.balanceType === "negative"
                  ? "text-red-600"
                  : "text-muted-foreground"
            }`}
          >
            {group.balanceType === "positive" && "+"}
            {group.balanceType === "negative" && "-"}
            {group.balanceType !== "neutral" ? `$${Math.abs(group.balance).toFixed(2)}` : "Settled up"}
          </div>
        </div>
      ))}
    </div>
  )
}
