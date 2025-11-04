"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, MapPin, Globe } from "lucide-react"

interface AddressSectionProps {
  address?: string
  city?: string
  postcode?: string
}

export function AddressSection({ address, city, postcode }: AddressSectionProps) {
  if (!address && !city && !postcode) return null

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] border border-orange-500/20 shadow-lg hover:border-orange-500/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {address && (
          <div className="flex items-start gap-4 p-3 rounded-lg bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] transition-colors group">
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors mt-0.5">
              <Building className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Address</p>
              <p className="text-sm font-medium text-gray-200">{address}</p>
            </div>
          </div>
        )}
        {city && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] transition-colors group">
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <MapPin className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">City</p>
              <p className="text-sm font-medium text-gray-200">{city}</p>
            </div>
          </div>
        )}
        {postcode && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[#2a2a2a]/50 hover:bg-[#2a2a2a] transition-colors group">
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <Globe className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Postcode</p>
              <p className="text-sm font-medium text-gray-200">{postcode}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

