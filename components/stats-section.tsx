"use client"

import { useEffect, useRef } from "react"

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-6 lg:px-12"
      style={{
        backgroundImage: "url('/hero/middle-0.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Tablet Frame with Image */}
        <div className="flex justify-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '0.1s' }}>
          <div className="relative">
            {/* Tablet Frame */}
            <div className="bg-gray-800 rounded-2xl p-4 shadow-2xl">
              {/* Tablet Screen */}
              <div className="bg-black rounded-xl p-3 relative">
                {/* Screen Bezel */}
                <div className="bg-gray-900 rounded-md p-3">
                  {/* Image Screen */}
                  <div className="relative overflow-hidden rounded-md">
                    <img 
                      src="/image.png" 
                      alt="CyberIx Dashboard" 
                      className="w-full h-auto rounded-md shadow-lg"
                    />
                    {/* Subtle overlay for tablet effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 rounded-md pointer-events-none"></div>
                  </div>
                </div>
              </div>
              
              {/* Tablet Home Button */}
              <div className="mt-3 flex justify-center">
                <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>
            
            {/* Tablet Stand/Base */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {/* Clients Stat */}
          <div className="space-y-2 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '0.2s' }}>
            <p className="text-orange-500 text-lg font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Actionable Custom Reports</p>
          </div>

          {/* Projects Stat */}
          <div className="space-y-2 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '0.3s' }}>
            <p className="text-orange-500 text-lg font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>AI-Driven Instant Fixes</p>
          </div>

          {/* Reviews Stat */}
          <div className="space-y-2 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '0.4s' }}>
            <p className="text-orange-500 text-lg font-medium" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Unified 360° Scanning</p>
          </div>
        </div>
      </div>
    </section>
  )
}
