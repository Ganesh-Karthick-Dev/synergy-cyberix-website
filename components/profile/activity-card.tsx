"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Activity {
  name: string
  action: string
  timestamp: string
  initials: string
}

interface ActivityCardProps {
  activities?: Activity[]
  showViewAll?: boolean
}

const defaultActivities: Activity[] = [
  {
    name: "John Miller",
    action: "last login",
    timestamp: "Jul 13, 2024, 05:36 PM",
    initials: "JM"
  },
  {
    name: "Merva Sahin",
    action: "date created",
    timestamp: "Sep 08, 2024, 03:12 PM",
    initials: "MS"
  },
  {
    name: "Tammy Collier",
    action: "updated",
    timestamp: "Aug 15, 2023, 05:36 PM",
    initials: "TC"
  }
]

export function ActivityCard({ activities = defaultActivities, showViewAll = true }: ActivityCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] border border-orange-500/20 shadow-lg hover:border-orange-500/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 p-4 rounded-lg bg-[#2a2a2a]/30 hover:bg-[#2a2a2a]/50 border border-transparent hover:border-orange-500/20 transition-all duration-200 group"
            >
              <Avatar className="h-10 w-10 ring-2 ring-orange-500/20 group-hover:ring-orange-500/40 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 text-orange-400 text-xs font-semibold">
                  {activity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 leading-relaxed">
                  <span className="font-semibold text-white">{activity.name}</span> {activity.action} on{" "}
                  <span className="text-gray-400">{activity.timestamp}</span>
                </p>
              </div>
            </div>
          ))}
          {showViewAll && (
            <a 
              href="#" 
              className="text-orange-400 hover:text-orange-300 text-sm font-medium inline-flex items-center gap-1 mt-4 transition-colors group"
            >
              View all
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

