"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, IdCard, Briefcase } from "lucide-react"

interface EmployeeDetailsSectionProps {
  dateOfBirth?: string
  nationalId?: string
  title?: string
  hireDate?: string
}

export function EmployeeDetailsSection({ 
  dateOfBirth, 
  nationalId, 
  title, 
  hireDate 
}: EmployeeDetailsSectionProps) {
  if (!dateOfBirth && !nationalId && !title && !hireDate) return null

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] border border-orange-500/20 shadow-lg hover:border-orange-500/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          Employee Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {dateOfBirth && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] transition-colors group">
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <Calendar className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Date of Birth</p>
              <p className="text-sm font-medium text-gray-200">{dateOfBirth}</p>
            </div>
          </div>
        )}
        {nationalId && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] transition-colors group">
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <IdCard className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">National ID</p>
              <p className="text-sm font-medium text-gray-200 font-mono">{nationalId}</p>
            </div>
          </div>
        )}
        {title && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] transition-colors group">
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <Briefcase className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Title</p>
              <p className="text-sm font-medium text-gray-200">{title}</p>
            </div>
          </div>
        )}
        {hireDate && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] transition-colors group">
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <Calendar className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Hire Date</p>
              <p className="text-sm font-medium text-gray-200">{hireDate}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

