"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface UserCardProps {
  displayName: string
  email?: string
  initials: string
}

export function UserCard({ displayName, email, initials }: UserCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] border border-orange-500/30 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300">
      <CardContent className="pt-8 pb-8 px-6">
        <div className="flex flex-col items-center text-center space-y-5">
          <div className="relative">
            <Avatar className="h-28 w-28 ring-4 ring-orange-500/20 ring-offset-4 ring-offset-[#1a1a1a]">
              <AvatarFallback className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white text-3xl font-bold shadow-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
              {displayName}
            </h3>
            <p className="text-sm text-gray-400 font-mono">#{email?.split('@')[0]?.toUpperCase() || 'USER'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

