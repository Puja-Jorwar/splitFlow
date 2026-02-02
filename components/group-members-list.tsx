import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function GroupMembersList() {
  const members = [
    {
      id: "1",
      name: "You",
      email: "you@example.com",
      avatar: "/placeholder.svg",
      initials: "YO",
      role: "Admin",
    },
    {
      id: "2",
      name: "Jim Halpert",
      email: "jim@example.com",
      avatar: "/placeholder.svg",
      initials: "JH",
      role: "Member",
    },
    {
      id: "3",
      name: "Pam Beesly",
      email: "pam@example.com",
      avatar: "/placeholder.svg",
      initials: "PB",
      role: "Member",
    },
    {
      id: "4",
      name: "Dwight Schrute",
      email: "dwight@example.com",
      avatar: "/placeholder.svg",
      initials: "DS",
      role: "Member",
    },
  ]

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{member.name}</div>
              <div className="text-xs text-muted-foreground">{member.email}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">{member.role}</div>
        </div>
      ))}
      <Button variant="outline" className="w-full mt-2">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Member
      </Button>
    </div>
  )
}
