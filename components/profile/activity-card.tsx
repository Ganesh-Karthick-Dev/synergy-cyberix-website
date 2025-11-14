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
    <Card className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] border border-orange-500/20 shadow-xl shadow-orange-500/5 hover:border-orange-500/40 hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full shadow-sm shadow-orange-500/50"></div>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 p-4 rounded-xl bg-[#2a2a2a]/40 hover:bg-[#2a2a2a]/70 border border-transparent hover:border-orange-500/30 transition-all duration-300 group/item cursor-pointer backdrop-blur-sm"
            >
              <Avatar className="h-12 w-12 ring-2 ring-orange-500/30 group-hover/item:ring-orange-500/50 transition-all duration-300 group-hover/item:scale-110">
                <AvatarFallback className="bg-gradient-to-br from-orange-500/20 via-orange-600/20 to-orange-500/20 text-orange-400 text-sm font-bold shadow-sm">
                  {activity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 leading-relaxed">
                  <span className="font-semibold text-white group-hover/item:text-orange-100 transition-colors">{activity.name}</span> {activity.action} on{" "}
                  <span className="text-gray-400 font-medium">{activity.timestamp}</span>
                </p>
              </div>
            </div>
          ))}
          {showViewAll && (
            <a 
              href="#" 
              className="text-orange-400 hover:text-orange-300 text-sm font-semibold inline-flex items-center gap-2 mt-4 transition-all duration-300 hover:gap-3 group/link"
            >
              <span>View all activity</span>
              <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

