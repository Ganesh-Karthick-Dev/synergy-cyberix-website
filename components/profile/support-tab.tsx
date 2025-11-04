"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Mail } from "lucide-react"

export function SupportTab() {
  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] border border-orange-500/20 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
          <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          Support
        </CardTitle>
        <CardDescription className="text-gray-400 text-base">Get help and contact our support team</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#2a2a2a] border border-orange-500/20 p-6">
              <HelpCircle className="w-8 h-8 text-orange-500 mb-4" />
              <h4 className="font-semibold text-white mb-2">Help Center</h4>
              <p className="text-sm text-gray-400 mb-4">Browse our knowledge base and FAQs</p>
              <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                Visit Help Center
              </Button>
            </Card>
            <Card className="bg-[#2a2a2a] border border-orange-500/20 p-6">
              <Mail className="w-8 h-8 text-orange-500 mb-4" />
              <h4 className="font-semibold text-white mb-2">Contact Support</h4>
              <p className="text-sm text-gray-400 mb-4">Reach out to our support team</p>
              <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                Contact Us
              </Button>
            </Card>
          </div>
          <div className="p-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Submit a Ticket</h4>
            <p className="text-sm text-gray-400 mb-4">Need specific help? Submit a support ticket</p>
            <Button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white">
              Submit Ticket
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

