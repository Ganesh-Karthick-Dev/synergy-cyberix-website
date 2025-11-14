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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({ name: "", email: "", subject: "", message: "" })
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
                      <Mail className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                        Email
                      </h3>
                      <a 
                        href="mailto:contact@cyberix.com"
                        className="text-white/80 hover:text-orange-400 transition-colors"
                        style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                      >
                        contact@cyberix.com
                      </a>
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
                      <a 
                        href="tel:+1555CYBERIX"
                        className="text-white/80 hover:text-orange-400 transition-colors"
                        style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                      >
                        +1 (555) CYBERIX
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                        Address
                      </h3>
                      <p className="text-white/80" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                        Cyberix Security Center<br />
                        Silicon Valley, CA 94000<br />
                        United States
                      </p>
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
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
                >
                  Send Message
                  <Send className="w-5 h-5" />
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

