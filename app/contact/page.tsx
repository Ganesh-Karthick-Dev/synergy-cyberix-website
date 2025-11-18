"use client"

import { SharedNavbar } from "@/components/shared-navbar"
import { FooterSection } from "@/components/footer-section"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function ContactPage() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitMessage({ type: 'success', text: data.message || "Thank you for your message! We'll get back to you soon." })
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitMessage({ type: 'error', text: data.error?.message || 'Failed to send message. Please try again.' })
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitMessage({ type: 'error', text: 'Failed to send message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
              Contact <span className="text-orange-500">Us</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-6"></div>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Get in touch with us. We're here to help with your cybersecurity needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                  Get in Touch
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                        Address
                      </h3>
                      <p className="text-white/80" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                        No 721/2, Venky complex,<br />
                        Second floor, cross-cut road,<br />
                        Seth Narang Das Layout,<br />
                        Coimbatore – 641 012.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                        Phone
                      </h3>
                      <div className="space-y-2">
                        <a 
                          href="tel:+919786557739"
                          className="block text-white/80 hover:text-orange-400 transition-colors"
                          style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                        >
                          +91 97865 57739
                        </a>
                        <a 
                          href="tel:+919585125566"
                          className="block text-white/80 hover:text-orange-400 transition-colors"
                          style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                        >
                          +91 95851 25566
                        </a>
                        <a 
                          href="tel:+916380072252"
                          className="block text-white/80 hover:text-orange-400 transition-colors"
                          style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                        >
                          +91 63800 72252
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                        Email
                      </h3>
                      <a 
                        href="mailto:info@webnoxdigital.com"
                        className="text-white/80 hover:text-orange-400 transition-colors"
                        style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                      >
                        info@webnoxdigital.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                    Business Hours
                  </h3>
                  <p className="text-white/80 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                Send us a Message
              </h2>
              {submitMessage && (
                <div className={`mb-4 p-4 rounded-lg ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                }`}>
                  <p className="text-sm font-medium">{submitMessage.text}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Your name"
                    style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="your.email@example.com"
                    style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="What's this about?"
                    style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white/80 text-sm mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                    style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  )
}

