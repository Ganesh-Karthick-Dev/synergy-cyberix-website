"use client"
import { useState, useEffect, useRef } from 'react'
import { useRegistration } from "@/components/registration-context"

export function FreeTrialSection() {
  const [isHovered, setIsHovered] = useState(false)
  const { openModal } = useRegistration()
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
    <section ref={sectionRef} className="relative py-20 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            Get a Free Trial with
            <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Full Network Scanning Access
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms', fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
            Experience the power of comprehensive network security scanning. 
            Discover vulnerabilities before they become threats.
          </p>

          {/* CTA Button */}
          <div className="relative inline-block animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '400ms' }}>
            <a
              href="/register"
              className={`
                relative inline-block px-12 py-6 text-xl font-bold text-white rounded-2xl
                transition-all duration-500 transform
                ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100 shadow-xl'}
                bg-gradient-to-r from-orange-500 to-orange-600
                hover:from-orange-400 hover:to-orange-500
                border-2 border-orange-400/50
                hover:border-orange-300/70
                backdrop-blur-sm
                group
                cursor-pointer
              `}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Button Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
              
              {/* Button Content */}
              <span className="relative z-10 flex items-center gap-3" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Free Network Scan Trial
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-orange-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </a>
          </div>

          

          
        </div>
      </div>
    </section>
  )
}
