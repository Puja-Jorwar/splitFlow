import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function GroupBalanceSummary() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Current Balances</h3>
      <div className="grid gap-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="You" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <span className="font-medium">You</span>
          </div>
          <div className="text-green-600 font-medium">+$171.50</div>
        </div>
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Jim H." />
              <AvatarFallback>JH</AvatarFallback>
            </Avatar>
            <span className="font-medium">Jim Halpert</span>
          </div>
          <div className="text-red-600 font-medium">-$128.35</div>
        </div>
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Pam B." />
              <AvatarFallback>PB</AvatarFallback>
            </Avatar>
            <span className="font-medium">Pam Beesly</span>
          </div>
          <div className="text-red-600 font-medium">-$43.15</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Dwight S." />
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
            <span className="font-medium">Dwight Schrute</span>
          </div>
          <div className="text-green-600 font-medium">+$0.00</div>
        </div>
      </div>
    </div>
  )
}
