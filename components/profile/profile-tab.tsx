"use client"

import { UserCard } from "./user-card"
import { AboutSection } from "./about-section"
import { AddressSection } from "./address-section"
import { EmployeeDetailsSection } from "./employee-details-section"
import { ActivityCard } from "./activity-card"

interface UserInfo {
  email?: string
  name?: string
  firstName?: string
  lastName?: string
  phone?: string
  companyName?: string
  location?: string
  hireDate?: string
}

interface ProfileTabProps {
  userInfo: UserInfo | null
}

export function ProfileTab({ userInfo }: ProfileTabProps) {
  const displayName = userInfo?.name || userInfo?.email?.split('@')[0] || 'User'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Left Column - User Card & Personal Info */}
      <div className="lg:col-span-1 space-y-6">
        <UserCard 
          displayName={displayName}
          email={userInfo?.email}
          initials={initials}
        />
        <AboutSection 
          phone={userInfo?.phone}
          email={userInfo?.email}
        />
        <AddressSection 
          companyName={userInfo?.companyName}
          location={userInfo?.location}
        />
        <EmployeeDetailsSection 
          hireDate={userInfo?.hireDate}
        />
      </div>

      {/* Right Column - Activity */}
      <div className="lg:col-span-2 space-y-6">
        <ActivityCard />
      </div>
    </div>
  )
}

