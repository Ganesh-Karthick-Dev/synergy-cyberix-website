"use client"

import { SharedNavbar } from "@/components/shared-navbar"
import { FooterSection } from "@/components/footer-section"
import { Mail, MessageCircle, Book, HelpCircle, FileText, Phone } from "lucide-react"
import { useEffect, useRef } from "react"

export default function SupportPage() {
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
  const supportOptions = [
    {
      icon: HelpCircle,
      title: "FAQs",
      description: "Find answers to commonly asked questions about our platform, features, and services.",
      link: "/#faq"
    },
    {
      icon: Book,
      title: "Knowledge Base",
      description: "Comprehensive documentation and guides to help you get the most out of Cyberix.",
      link: "#"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time for immediate assistance with your questions.",
      link: "#"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours during business days.",
      link: "mailto:support@cyberix.com"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team. Available Monday-Friday, 9 AM - 6 PM EST.",
      link: "tel:+1555CYBERIX"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Access our API documentation, integration guides, and technical resources.",
      link: "#"
    }
  ]

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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
              Customer <span className="text-orange-500">Support</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-6"></div>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              We're here to help. Get the support you need to secure your digital infrastructure.
            </p>
          </div>

          {/* Support Options Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {supportOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <a
                  key={index}
                  href={option.link}
                  className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 block animate-on-scroll opacity-0 translate-y-8"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                    {option.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    {option.description}
                  </p>
                </a>
              )
            })}
          </div>

          {/* Contact Information */}
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-3" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  Email
                </h3>
                <a 
                  href="mailto:support@cyberix.com"
                  className="text-white/80 hover:text-orange-400 transition-colors"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  support@cyberix.com
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-3" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  Phone
                </h3>
                <a 
                  href="tel:+1555CYBERIX"
                  className="text-white/80 hover:text-orange-400 transition-colors"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  +1 (555) CYBERIX
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-3" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  Business Hours
                </h3>
                <p className="text-white/80" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-3" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  Response Time
                </h3>
                <p className="text-white/80" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Email: Within 24 hours<br />
                  Phone: Immediate during business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  )
}

