"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JobInformation {
  department: string
  division: string
  manager: string
  hireDate: string
}

interface JobInformationCardProps {
  jobs?: JobInformation[]
}

const defaultJobs: JobInformation[] = [
  {
    department: "Creative",
    division: "Project Management",
    manager: "Alex Foster",
    hireDate: "May 13, 2024"
  }
]

export function JobInformationCard({ jobs = defaultJobs }: JobInformationCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] border border-orange-500/20 shadow-lg hover:border-orange-500/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          Job Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto rounded-lg border border-orange-500/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#2a2a2a] to-[#252525] border-b border-orange-500/20">
                <th className="text-left py-4 px-5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Department</th>
                <th className="text-left py-4 px-5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Division</th>
                <th className="text-left py-4 px-5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Manager</th>
                <th className="text-left py-4 px-5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Hire Date</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr 
                  key={index}
                  className="border-b border-orange-500/5 hover:bg-gradient-to-r hover:from-orange-500/5 hover:to-orange-600/5 transition-all duration-200"
                >
                  <td className="py-4 px-5 text-gray-200 font-medium">{job.department}</td>
                  <td className="py-4 px-5 text-gray-300">{job.division}</td>
                  <td className="py-4 px-5 text-gray-300">{job.manager}</td>
                  <td className="py-4 px-5 text-gray-400">{job.hireDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

