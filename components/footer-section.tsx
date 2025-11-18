"use client"

import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { memo, useEffect, useRef } from "react"
import { gsap } from "gsap"
import Image from "next/image"
import Link from "next/link"

const FooterSection = memo(() => {
  const cyberixTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cyberixTextRef.current) {
      const textElement = cyberixTextRef.current.querySelector('.cyberix-char')
      const tspanElements = cyberixTextRef.current.querySelectorAll('tspan')
      
      if (textElement && tspanElements.length > 0) {
        // Set initial state for all letters
        gsap.set(textElement, { 
          opacity: 0,
          scale: 0.8
        })
        
        gsap.set(tspanElements, {
          opacity: 0,
          scale: 0.5
        })
        
        // Animate text container
        gsap.to(textElement, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out'
        })
        
        // Animate each letter sequentially
        gsap.to(tspanElements, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: (index) => index * 0.1,
          ease: 'power3.out'
        })
      }
    }
  }, [])

  return (
    <footer 
      className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white overflow-hidden"
    >
      {/* Orange accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500"></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,165,0,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-16 lg:pt-20 pb-0">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
          {/* About Us */}
          <div className="space-y-5">
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                About Cyberix
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-2"></div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              We're a leading cybersecurity company providing advanced AI-driven security solutions that protect businesses from evolving cyber threats with enterprise-grade protection and automated response systems.
            </p>
          </div>

          {/* Useful Links */}
          <div className="space-y-5">
            <div className="relative">
              <h3 className="text-2xl font-bold text-orange-500 mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                Useful Links
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-2"></div>
            </div>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/#about-us" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-sm flex items-center group"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/#why-choose" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-sm flex items-center group"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/#pricing" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-sm flex items-center group"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Prices
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-5">
            <div className="relative">
              <h3 className="text-2xl font-bold text-orange-500 mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                Help
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-2"></div>
            </div>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/support" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-sm flex items-center group"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Customer Support
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-sm flex items-center group"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-sm flex items-center group"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-sm flex items-center group"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="space-y-5">
            <div className="relative">
              <h3 className="text-2xl font-bold text-orange-500 mb-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                Connect With Us
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-2"></div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-gray-300 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  No 721/2, Venky complex,<br />
                  Second floor, cross-cut road,<br />
                  Seth Narang Das Layout,<br />
                  Coimbatore – 641 012.
                </p>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a 
                  href="tel:+919786557739" 
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  +91 97865 57739
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a 
                  href="tel:+919585125566" 
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  +91 95851 25566
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a 
                  href="tel:+916380072252" 
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  +91 63800 72252
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a 
                  href="mailto:info@webnoxdigital.com" 
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                  style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
                >
                  info@webnoxdigital.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800/50 p-8 ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              © 2025 Cyberix Security Solutions. All Rights Reserved.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://webnox.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-gray-700 hover:border-orange-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a
                href="https://webnox.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-gray-700 hover:border-orange-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a
                href="https://webnox.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-gray-700 hover:border-orange-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a
                href="https://webnox.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-gray-700 hover:border-orange-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/20"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            </div>
          </div>
        </div>

        {/* Sci-Fi CYBERIX Text */}
        <div className="border-t border-gray-800/50 pb-0 overflow-visible">
          <div className="flex items-stretch justify-between gap-8 w-full overflow-visible" >
            <div 
              ref={cyberixTextRef}
              className="w-[70%] overflow-visible flex items-center"
            >
              <svg 
                className="w-full h-auto"
                viewBox="0 0 1150 250"
                preserveAspectRatio="xMidYMid meet"
                style={{ maxHeight: '250px', minHeight: '120px' }}
              >
                <text
                  x="0"
                  y="200"
                  className="cyberix-char"
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '180px',
                    fontWeight: '900',
                    fill: 'none',
                    stroke: '#ff6b35',
                    strokeWidth: '3.5',
                    strokeLinejoin: 'miter',
                    strokeLinecap: 'square',
                    strokeMiterlimit: '10',
                    paintOrder: 'stroke fill',
                    textRendering: 'optimizeLegibility',
                    fontVariantLigatures: 'none',
                    fontKerning: 'none'
                  }}
                >
                  <tspan x="0" dy="0">C</tspan>
                  <tspan x="190" dy="0">Y</tspan>
                  <tspan x="360" dy="0">B</tspan>
                  <tspan x="530" dy="0">E</tspan>
                  <tspan x="700" dy="0">R</tspan>
                  <tspan x="870" dy="0">I</tspan>
                  <tspan x="940" dy="0">X</tspan>
                </text>
              </svg>
            </div>
            {/* Logo on the right */}
            <div className="hidden lg:block w-[30%] h-full ">
              <div className=" h-[250px] flex items-center relative w-full" style={{ paddingTop: '8px' }}>
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full blur-3xl scale-150"></div>
                {/* Logo with enhanced clarity */}
                <Image
                  src="/logo/icons8-security-shield-64.png"
                  alt="Cyberix Logo"
                  width={200}
                  height={200}
                  unoptimized={true}
                  className="w-[150px] h-[150px] object-contain relative z-10 drop-shadow-2xl filter brightness-110 contrast-110 saturate-110"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 107, 53, 0.4)) drop-shadow(0 0 40px rgba(255, 107, 53, 0.2)) brightness(1.1) contrast(1.1) saturate(1.1)',
                    marginTop: '4px',
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Legal links below CYBERIX */}
          {/* <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6 text-sm">
            <a 
              href="#privacy" 
              className="text-gray-400 hover:text-orange-400 transition-colors"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
            >
              Privacy Policy
            </a>
            <span className="text-gray-600">•</span>
            <a 
              href="#terms" 
              className="text-gray-400 hover:text-orange-400 transition-colors"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}
            >
              Terms and Conditions
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  )
})

FooterSection.displayName = 'FooterSection'

export { FooterSection }
