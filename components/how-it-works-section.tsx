"use client"

import { Shield, Search, Lock } from "lucide-react"
import SpotlightCard from './SpotlightCard';
import { useEffect, useRef } from 'react'

export function HowItWorksSection() {
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
      className="py-20 px-6"
      style={{
        backgroundImage: "url('/hero/middle-0.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            Simple Process, <span className="text-orange-500">Powerful Results</span>
          </h2>
          <p className="text-white/80 text-xl leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
            Get comprehensive security insights in just 4 simple steps. Our AI-powered platform does the heavy lifting while you focus on what matters most.
          </p>
        </div>

        {/* 4-Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1: Quick Setup */}
          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  Quick Setup
                </h3>
                
                <p className="text-white/90 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Enter your target domain or IP address. Our platform automatically discovers your infrastructure.
                </p>
                
               </div>
            </div>
          </SpotlightCard>

          {/* Step 2: Select Scans */}
          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
              
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Select Scans
              </h3>
              
              <p className="text-white/90 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Choose from 7 specialized security modules tailored to your specific security needs.
              </p>
              
               </div>
            </div>
          </SpotlightCard>

          {/* Step 3: AI Analysis */}
          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '300ms' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
              
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                AI Analysis
              </h3>
              
              <p className="text-white/90 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Advanced scanning with machine learning detection identifies sophisticated threats automatically.
              </p>
              
               </div>
            </div>
          </SpotlightCard>

          {/* Step 4: Professional Reports */}
          <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '400ms' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl font-bold">4</span>
                </div>
              
              <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Professional Reports
              </h3>
              
              <p className="text-white/90 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Download comprehensive PDF documentation with actionable insights and remediation steps.
              </p>
              
               </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  )
}
