"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

interface EmployeeDetailsSectionProps {
  hireDate?: string
}

export function EmployeeDetailsSection({ 
  hireDate 
}: EmployeeDetailsSectionProps) {
  if (!hireDate) return null

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] border border-orange-500/20 shadow-xl shadow-orange-500/5 hover:border-orange-500/40 hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full shadow-sm shadow-orange-500/50"></div>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>Employee Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {hireDate && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#2a2a2a]/60 hover:bg-[#2a2a2a] border border-transparent hover:border-orange-500/20 transition-all duration-300 group/item cursor-pointer">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 group-hover/item:from-orange-500/20 group-hover/item:to-orange-600/20 transition-all duration-300 shadow-sm">
              <Calendar className="w-5 h-5 text-orange-400 group-hover/item:text-orange-300 transition-colors" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Hire Date</p>
              <p className="text-sm font-semibold text-gray-100">{hireDate}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

