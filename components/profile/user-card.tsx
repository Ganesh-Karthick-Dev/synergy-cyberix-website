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
    <Card className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] border border-orange-500/30 shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 hover:border-orange-500/50 transition-all duration-500 overflow-hidden relative group">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardContent className="pt-10 pb-10 px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <Avatar className="h-32 w-32 ring-4 ring-orange-500/30 ring-offset-4 ring-offset-[#1a1a1a] relative z-10 group-hover:scale-105 transition-transform duration-300">
              <AvatarFallback className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white text-4xl font-bold shadow-xl shadow-orange-500/30">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-3 border-[#1a1a1a] rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white group-hover:text-orange-100 transition-colors duration-300" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
              {displayName}
            </h3>
            <p className="text-sm text-gray-400 font-mono bg-[#2a2a2a]/50 px-3 py-1 rounded-full inline-block">{email?.split('@')[0]?.toUpperCase() || 'USER'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

