"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { SharedNavbar } from "@/components/shared-navbar"
import { FooterSection } from "@/components/footer-section"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useAuth } from "@/components/auth-context"
import { useQuery } from "@tanstack/react-query"

async function fetchActiveSubscription() {
  try {
    const response = await fetch('/api/subscription/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('[Download Page] Error fetching subscription:', error)
    return null
  }
}

export const dynamic = 'force-dynamic'

export default function DownloadPage() {
  const router = useRouter()
  const { openLoginModal } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  // Check authentication and subscription
  const { data: activeSubscription } = useQuery({
    queryKey: ['activeSubscription', 'download-page'],
    queryFn: fetchActiveSubscription,
    enabled: true,
    refetchInterval: 60000,
    retry: false,
    staleTime: 0,
  })

  useEffect(() => {
    const checkAccess = () => {
      const isAuth = Cookies.get('isAuthenticated') === 'true'
      const token = Cookies.get('accessToken')
      const loggedIn = isAuth || !!token

      if (!loggedIn) {
        // Not logged in - redirect to login with return URL
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('redirectAfterLogin', '/download')
        }
        openLoginModal()
        // Don't set hasAccess, will redirect
        setIsChecking(false)
        return
      }

      // Check if user has active subscription
      if (activeSubscription) {
        const endDate = activeSubscription.endDate ? new Date(activeSubscription.endDate) : null
        const isLifetime = activeSubscription.endDate === null
        const now = new Date()
        const isExpired = endDate ? endDate <= now : false
        const hasActive = activeSubscription.status === 'ACTIVE' && (isLifetime || !isExpired)
        
        if (hasActive) {
          setHasAccess(true)
          setIsChecking(false)
          return
        }
      }

      // Logged in but no active subscription - redirect to pricing
      router.push('/pricing')
      setIsChecking(false)
    }

    // Wait a bit for subscription data to load
    if (activeSubscription !== undefined) {
      checkAccess()
    }
  }, [activeSubscription, router, openLoginModal])

  const handleDownload = (platform: string) => {
    // Simulate download - in real app, this would trigger actual download
    alert(`Downloading Cyberix Security Scanner for ${platform}...`)
  }

  // Show loading state while checking
  if (isChecking || !hasAccess) {
    return (
      <div 
        className="min-h-screen relative flex flex-col"
        style={{
          backgroundImage: "url('/hero/middle-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <SharedNavbar />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="text-white text-xl">Checking access...</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen relative flex flex-col"
      style={{
        backgroundImage: "url('/hero/middle-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <SharedNavbar />

      {/* Main Content */}
      <div className="relative pt-32 pb-16 min-h-[80vh]">
        {/* Orange decorative element in top-left corner */}
        <div className="absolute top-8 left-8 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-12 left-12 w-12 h-12 bg-orange-400/30 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl font-bold text-white mb-6 animate-slide-up" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700', animationDelay: '0.2s' }}>
            Download Cyberix Security Scanner
          </h1>
          <p className="text-xl text-gray-300 mb-12 animate-slide-up" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400', animationDelay: '0.4s' }}>
            {/* Choose your platform to download the free security scanner */}
          </p>
        </div>

        <div className="flex justify-center items-start max-w-4xl mx-auto">
          {/* Windows Download */}
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/logo/download/icons8-windows-10-96.webp" 
                  alt="Windows Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>Windows</CardTitle>
              <CardDescription className="text-gray-300" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Windows 10/11 (64-bit)
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>Version 2.1.0 • 128 MB</p>
              <Button 
                onClick={() => handleDownload('Windows')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-5 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download for Windows
              </Button>
            </CardContent>
          </Card>

          {/* Mac Download */}
          {/* <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Laptop className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>macOS</CardTitle>
              <CardDescription className="text-gray-300" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                macOS 10.15+ (Intel & Apple Silicon)
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>Version 2.1.0 • 52.8 MB</p>
              <Button 
                onClick={() => handleDownload('macOS')}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download for macOS
              </Button>
            </CardContent>
          </Card> */}

          {/* Linux Download */}
          {/* <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '1.0s' }}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/logo/download/icons8-linux-48.webp" 
                  alt="Linux Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>Linux</CardTitle>
              <CardDescription className="text-gray-300" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Ubuntu 18.04+ / CentOS 7+
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>Version 2.1.0 • 120 MB</p>
              <Button 
                onClick={() => handleDownload('Linux')}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-5 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download for Linux
              </Button>
            </CardContent>
          </Card> */}
        </div>

        <div className="text-center mt-16 animate-slide-up" style={{ animationDelay: '1.2s' }}>
          <p className="text-gray-400 mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
            Need help getting started? Check out our documentation
          </p>
          <Button 
            onClick={() => alert('Opening documentation...')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
          >
            View Documentation
          </Button>
        </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <FooterSection />
      </div>
    </div>
  )
}
