"use client"

import { SharedNavbar } from "@/components/shared-navbar"
import { FooterSection } from "@/components/footer-section"
import { useEffect, useRef } from "react"

export default function TermsPage() {
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
    <div className="min-h-screen flex flex-col">
      <SharedNavbar />
      <section 
        ref={sectionRef}
        className="flex-1 pt-24 pb-16 px-4"
        style={{
          backgroundImage: "url('/hero/middle-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
              Terms & <span className="text-orange-500">Conditions</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-6"></div>
            <p className="text-white/60 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Last Updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                1. Acceptance of Terms
              </h2>
              <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                By accessing and using the Cyberix platform and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                2. Use License
              </h2>
              <p className="text-white/80 text-base leading-relaxed mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Permission is granted to temporarily use Cyberix services for personal or commercial security scanning purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-base ml-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                <li>Modify or copy the materials or services</li>
                <li>Use the services for any illegal purpose or in violation of any laws</li>
                <li>Attempt to reverse engineer or extract source code from our platform</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
              </ul>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                3. Service Availability
              </h2>
              <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Cyberix strives to provide reliable and continuous service availability. However, we do not guarantee that the service will be available at all times. We reserve the right to perform maintenance, updates, or modifications that may temporarily interrupt service availability.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                4. User Responsibilities
              </h2>
              <p className="text-white/80 text-base leading-relaxed mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Users are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-base ml-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                <li>Maintaining the confidentiality of their account credentials</li>
                <li>Ensuring they have proper authorization to scan any target systems</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Using the service in an ethical and responsible manner</li>
              </ul>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                5. Limitation of Liability
              </h2>
              <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                In no event shall Cyberix or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Cyberix's platform, even if Cyberix or a Cyberix authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                6. Revisions and Errata
              </h2>
              <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                The materials appearing on Cyberix's platform could include technical, typographical, or photographic errors. Cyberix does not warrant that any of the materials on its platform are accurate, complete, or current. Cyberix may make changes to the materials contained on its platform at any time without notice.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                7. Contact Information
              </h2>
              <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <p className="text-white/80 text-base leading-relaxed mt-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Email: <a href="mailto:legal@cyberix.com" className="text-orange-500 hover:text-orange-400">legal@cyberix.com</a><br />
                Phone: <a href="tel:+1555CYBERIX" className="text-orange-500 hover:text-orange-400">+1 (555) CYBERIX</a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  )
}

