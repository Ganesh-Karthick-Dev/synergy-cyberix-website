"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "How accurate are the vulnerability detections?",
    answer:
      "CyberIx uses advanced AI and machine learning to minimize false positives, achieving 98% accuracy in vulnerability detection with proof-based validation. Our algorithms are continuously trained on the latest threat intelligence.",
  },
  {
    question: "Can I integrate CyberIx with my existing security tools?",
    answer:
      "Yes, CyberIx provides REST API access and supports integrations with popular security platforms, SIEM tools, and development workflows. We offer pre-built connectors for major security ecosystems.",
  },
  {
    question: "What compliance frameworks does CyberIx support?",
    answer:
      "Our reports map to major frameworks including OWASP Top 10, NIST Cybersecurity Framework, PCI-DSS, and ISO 27001. We provide automated compliance checking and generate audit-ready documentation.",
  },
  {
    question: "How long does a comprehensive scan take?",
    answer:
      "Scan times vary by target size and complexity. Most website scans complete in 5-15 minutes, while comprehensive infrastructure assessments may take 30-60 minutes. You can monitor progress in real-time through our dashboard.",
  },
  {
    question: "Can cloud and container scanning secure multi-cloud environments?",
    answer:
      "Yes. Our cloud/container scanning identifies misconfigurations, exposed APIs, and insecure images across AWS, Azure, GCP, and Kubernetes. It provides a unified dashboard, enabling you to enforce security policies across all environments in real-time.",
  },
]

interface FAQSectionProps {
  className?: string
}

export function FAQSection({ className = "" }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<number[]>([0]) // First item open by default
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

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <section 
      ref={sectionRef}
      className={`relative pt-8 pb-30 px-4 ${className}`}
      style={{
        backgroundImage: "url('/hero/above footer.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            Frequently Asked
            <br />
            Questions
          </h2>
          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
            Got questions? We've got answers. Find everything you need to know about using our platform, plans, and
            features.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-black/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:bg-black/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700"
              style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between group"
              >
                <span className="text-white text-lg md:text-xl font-medium pr-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>{item.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-orange-500 transition-transform duration-300 flex-shrink-0 ${
                    openItems.includes(index) ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openItems.includes(index) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-white/90 text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
