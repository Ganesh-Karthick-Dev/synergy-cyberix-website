import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { memo } from "react"

const FooterSection = memo(() => {
  return (
    <footer 
      className="relative border-t border-white/10 text-white overflow-hidden will-change-transform"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #ff6b35 100%)",
        contain: "layout style paint",
        transform: "translateZ(0)"
      }}
    >
      {/* Background Overlay for better text readability - GPU accelerated */}
      <div 
        className="absolute inset-0 bg-black/20 will-change-auto"
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden"
        }}
      ></div>
      
      <div className="relative z-10 container mx-auto px-6 py-16 will-change-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 will-change-auto">
          {/* About Us */}
          <div className="space-y-4 will-change-auto">
            <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>About Cyberix</h3>
            <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              We're a leading cybersecurity company providing advanced AI-driven security solutions that protect businesses from evolving cyber threats with enterprise-grade protection and automated response systems.
            </p>
          </div>

          {/* Useful Links */}
          <div className="space-y-4 will-change-auto">
            <h3 className="text-xl font-semibold text-orange-500" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>Useful Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors text-sm will-change-auto" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors text-sm will-change-auto" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Services
                </a>
              </li>
              <li>
                <a href="#team" className="text-gray-300 hover:text-white transition-colors text-sm will-change-auto" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Team
                </a>
              </li>
              <li>
                <a href="#prices" className="text-gray-300 hover:text-white transition-colors text-sm will-change-auto" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  Prices
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4 will-change-auto">
            <h3 className="text-xl font-semibold text-orange-500" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>Help</h3>
            <ul className="space-y-3">
              <li>
                <a href="#support" className="text-gray-300 hover:text-white transition-colors text-sm will-change-auto">
                  Customer Support
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-300 hover:text-white transition-colors text-sm will-change-auto">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-300 hover:text-white transition-colors text-sm will-change-auto">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors text-sm will-change-auto">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="space-y-4 will-change-auto">
            <h3 className="text-xl font-semibold text-orange-500" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>Connect With Us</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-300">
                Cyberix Security Center,
                <br />
                Silicon Valley, CA 94000
              </p>
              <p className="text-gray-300">+1 (555) CYBERIX</p>
              <p className="text-gray-300">contact@cyberix.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center will-change-auto">
          <p className="text-gray-400 text-sm mb-4 md:mb-0" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>© 2025 Cyberix Security Solutions. All Rights Reserved.</p>

          {/* Social Media Icons */}
          <div className="flex space-x-4 will-change-auto">
            <a
              href="#"
              className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors will-change-transform"
              aria-label="Facebook"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden"
              }}
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors will-change-transform"
              aria-label="Instagram"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden"
              }}
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors will-change-transform"
              aria-label="Twitter"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden"
              }}
            >
              <Twitter className="w-5 h-5 text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors will-change-transform"
              aria-label="YouTube"
              style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden"
              }}
            >
              <Youtube className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
})

FooterSection.displayName = 'FooterSection'

export { FooterSection }
