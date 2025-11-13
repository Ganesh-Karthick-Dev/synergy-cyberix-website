"use client"

import { SharedNavbar } from "@/components/shared-navbar"
import { FooterSection } from "@/components/footer-section"
import { useEffect, useRef } from "react"

export default function PrivacyPage() {
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
              Privacy <span className="text-orange-500">Policy</span>
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
                1. Information We Collect
              </h2>
              <p className="text-white/80 text-base leading-relaxed mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-base ml-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                <li>Account registration information (name, email address, phone number)</li>
                <li>Payment and billing information</li>
                <li>Target systems and URLs you submit for scanning</li>
                <li>Communication preferences and support requests</li>
                <li>Usage data and platform interaction information</li>
              </ul>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                2. How We Use Your Information
              </h2>
              <p className="text-white/80 text-base leading-relaxed mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-base ml-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends and usage patterns</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
              </ul>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                3. Information Sharing and Disclosure
              </h2>
              <p className="text-white/80 text-base leading-relaxed mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-base ml-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to respond to legal process</li>
                <li>To protect the rights, property, or safety of Cyberix, our users, or others</li>
                <li>In connection with a merger, acquisition, or sale of assets (with notice to users)</li>
              </ul>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                4. Data Security
              </h2>
              <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure data storage, and regular security assessments. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                5. Your Rights and Choices
              </h2>
              <p className="text-white/80 text-base leading-relaxed mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 text-base ml-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                <li>Access and receive a copy of your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                7. Changes to This Privacy Policy
              </h2>
              <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
              <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                8. Contact Us
              </h2>
              <p className="text-white/80 text-base leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-white/80 text-base leading-relaxed mt-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Email: <a href="mailto:privacy@cyberix.com" className="text-orange-500 hover:text-orange-400">privacy@cyberix.com</a><br />
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

