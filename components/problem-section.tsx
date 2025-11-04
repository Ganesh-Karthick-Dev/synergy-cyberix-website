"use client"

import { useEffect, useRef } from 'react'

export function ProblemSection() {
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
            Why Your Current Security Approach <span className="text-orange-500">Isn't Enough</span>
          </h2>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-orange-500/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
            <h3 className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent text-2xl font-semibold mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              Hidden Vulnerabilities
            </h3>
            <p className="text-white/80 text-lg leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              78% of security breaches exploit unknown weaknesses in your infrastructure that traditional tools miss.
            </p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-orange-500/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
            <h3 className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent text-2xl font-semibold mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              Advanced Phishing Attacks
            </h3>
            <p className="text-white/80 text-lg leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Sophisticated campaigns targeting financial and personal data with increasingly convincing techniques.
            </p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-orange-500/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '300ms' }}>
            <h3 className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent text-2xl font-semibold mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              API Security Gaps
            </h3>
            <p className="text-white/80 text-lg leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Undocumented endpoints and business logic flaws that expose your most sensitive data.
            </p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-orange-500/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '400ms' }}>
            <h3 className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent text-2xl font-semibold mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              Compliance Challenges
            </h3>
            <p className="text-white/80 text-lg leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Meeting regulatory requirements with manual processes that are time-consuming and error-prone.
            </p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-orange-500/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '500ms' }}>
            <h3 className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent text-2xl font-semibold mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              Resource Constraints
            </h3>
            <p className="text-white/80 text-lg leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Limited security expertise and tools that leave critical gaps in your defense strategy.
            </p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-8 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:bg-orange-500/20 hover:backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '600ms' }}>
            <h3 className="bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-transparent text-2xl font-semibold mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              The Result
            </h3>
            <p className="text-white/80 text-lg leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Critical security gaps that leave your organization exposed to costly breaches, data theft, and compliance violations.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '700ms' }}>
          <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              Don't Wait Until It's Too Late
            </h3>
            <p className="text-white/90 text-lg mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Every day you wait is another day your organization remains vulnerable to sophisticated cyber attacks.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
