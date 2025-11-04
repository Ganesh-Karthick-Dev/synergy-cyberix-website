"use client"

import { useEffect, useRef } from 'react'

export function BenefitsSection() {
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
    <section ref={sectionRef} className="py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            Why Security Teams <span className="text-orange-500">Choose CyberIx</span>
          </h2>
        </div>

        {/* Core Benefits */}
        <div className="space-y-20 mb-16">
          {/* Proactive Security Posture */}
          <div className="py-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h3 className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                  Proactive Security Posture
                </h3>
              </div>
              <div className="lg:w-1/2">
                <ul className="text-white/80 text-xl space-y-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '100ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Identify vulnerabilities before attackers exploit them</span>
                  </li>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '200ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Continuous monitoring prevents security drift</span>
                  </li>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '300ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Advanced AI detection finds sophisticated threats</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Complete Visibility */}
          <div className="py-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <h3 className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                  Complete Visibility
                </h3>
              </div>
              <div className="lg:w-1/2">
                <ul className="text-white/80 text-xl space-y-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '100ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Comprehensive attack surface mapping</span>
                  </li>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '200ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Shadow asset discovery (APIs, subdomains, services)</span>
                  </li>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '300ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Real-time security status dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Compliance & Governance */}
          <div className="py-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h3 className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                  Compliance & Governance
                </h3>
              </div>
              <div className="lg:w-1/2">
                <ul className="text-white/80 text-xl space-y-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '100ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Professional PDF reports for audits</span>
                  </li>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '200ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Industry framework mapping (OWASP, NIST, PCI-DSS)</span>
                  </li>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '300ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Automated compliance checking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cost Optimization */}
          <div className="py-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <h3 className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                  Cost Optimization
                </h3>
              </div>
              <div className="lg:w-1/2">
                <ul className="text-white/80 text-xl space-y-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '100ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Prevent costly security incidents and breaches</span>
                  </li>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '200ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Reduce need for multiple security tools</span>
                  </li>
                  <li className="flex items-start animate-on-scroll opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '300ms' }}>
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                    <span>Minimize manual security assessment time</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
