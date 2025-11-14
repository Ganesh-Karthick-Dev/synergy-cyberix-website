"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CompensationItem {
  amount: string
  period: string
  effectiveDate: string
}

interface CompensationCardProps {
  compensations?: CompensationItem[]
  showViewAll?: boolean
}

const defaultCompensations: CompensationItem[] = [
  {
    amount: "862.00",
    period: "per month",
    effectiveDate: "May 10, 2015"
  },
  {
    amount: "1560.00",
    period: "per quarter",
    effectiveDate: "Jun 08, 2022"
  },
  {
    amount: "378.00",
    period: "per week",
    effectiveDate: "Jun 08, 2022"
  }
]

export function CompensationCard({ compensations = defaultCompensations, showViewAll = true }: CompensationCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] border border-orange-500/20 shadow-lg hover:border-orange-500/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          Compensation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {compensations.map((compensation, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/30 hover:from-[#2a2a2a] hover:to-[#2f2f2f] border border-orange-500/10 hover:border-orange-500/30 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-bold text-white">
                  ${compensation.amount} <span className="text-sm font-normal text-gray-400">USD</span>
                </p>
                <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium border border-orange-500/20">
                  {compensation.period}
                </span>
              </div>
              <p className="text-xs text-gray-500">Effective date: {compensation.effectiveDate}</p>
            </div>
          ))}
          {showViewAll && (
            <a 
              href="#" 
              className="text-orange-400 hover:text-orange-300 text-sm font-medium inline-flex items-center gap-1 mt-4 transition-colors group"
            >
              View all
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

