"use client"

import { ArrowUpRight, X, Fish, Plug, Globe, Search, Monitor, Shield, Network } from "lucide-react"
import { useRegistration } from "@/components/registration-context"
import { useState, useEffect, useRef } from "react"

interface Module {
  id: number
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  businessImpact: string
  features: string[]
  useCases: string[]
}

export function FeaturesSection() {
  const { openModal } = useRegistration()
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
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
  
  const modules = [
    {
      id: 1,
      title: "Advanced Phishing Detection",
      icon: Fish,
      description: "Protect against sophisticated phishing attacks with advanced visual similarity analysis, domain typosquatting detection, and AI-powered content analysis.",
      businessImpact: "Prevent financial fraud, identity theft, and corporate data breaches",
      features: [
        "Advanced visual similarity analysis comparing with legitimate sites",
        "Domain typosquatting detection for brand protection",
        "AI-powered content analysis for social engineering patterns",
        "Credential harvesting detection and form analysis",
        "Cross-reference with global phishing threat databases"
      ],
      useCases: [
        "Protect your brand from phishing attacks",
        "Detect fake websites targeting your customers",
        "Prevent credential theft and account takeovers",
        "Monitor for brand impersonation attempts"
      ]
    },
    {
      id: 2,
      title: "API Security Scanner",
      icon: Plug,
      description: "Secure your API infrastructure with complete endpoint discovery, authentication testing, shadow API detection, and business logic vulnerability assessment.",
      businessImpact: "Protect sensitive data, prevent financial losses, ensure compliance",
      features: [
        "Complete API endpoint discovery and inventory mapping",
        "Authentication and authorization vulnerability testing",
        "Shadow API detection for undocumented endpoints",
        "Business logic vulnerability assessment (IDOR, privilege escalation)",
        "Data sensitivity analysis and privacy compliance checking"
      ],
      useCases: [
        "Secure REST and GraphQL APIs",
        "Find hidden API endpoints",
        "Test authentication mechanisms",
        "Ensure data privacy compliance"
      ]
    },
    {
      id: 3,
      title: "Website Security Analyzer",
      icon: Globe,
      description: "Comprehensive web application security assessment including SQL injection, XSS detection, security header analysis, and SSL/TLS configuration testing.",
      businessImpact: "Secure customer data, maintain trust, avoid regulatory penalties",
      features: [
        "SQL injection and XSS vulnerability detection",
        "Security header analysis (CORS, CSP, HSTS)",
        "SSL/TLS configuration assessment",
        "Directory traversal and file inclusion testing",
        "Authentication bypass detection"
      ],
      useCases: [
        "Secure web applications",
        "Test for common vulnerabilities",
        "Improve security headers",
        "Ensure SSL/TLS best practices"
      ]
    },
    {
      id: 4,
      title: "Network Security Scanner",
      icon: Search,
      description: "Map and secure your network infrastructure with topology discovery, open port identification, device vulnerability assessment, and firewall testing.",
      businessImpact: "Prevent lateral movement, secure internal systems",
      features: [
        "Network topology discovery and mapping",
        "Open port identification and service enumeration",
        "Network device vulnerability assessment",
        "Firewall rule effectiveness testing",
        "Network segmentation analysis"
      ],
      useCases: [
        "Map network infrastructure",
        "Find open ports and services",
        "Test firewall configurations",
        "Assess network segmentation"
      ]
    },
    {
      id: 5,
      title: "Server Security Assessment",
      icon: Monitor,
      description: "Comprehensive server hardening with OS vulnerability scanning, service configuration analysis, privilege escalation testing, and compliance mapping.",
      businessImpact: "Secure critical infrastructure, maintain system integrity",
      features: [
        "Operating system vulnerability scanning",
        "Service configuration analysis",
        "Privilege escalation testing",
        "Server hardening recommendations",
        "Compliance framework mapping"
      ],
      useCases: [
        "Harden server configurations",
        "Find OS vulnerabilities",
        "Test privilege escalation",
        "Ensure compliance standards"
      ]
    },
    {
      id: 6,
      title: "Malware & Defacement Monitor",
      icon: Shield,
      description: "Continuous monitoring for malicious changes with real-time website change detection, malware signature scanning, and automated threat response.",
      businessImpact: "Maintain brand reputation, ensure website availability",
      features: [
        "Real-time website change detection",
        "Malware signature scanning",
        "Defacement monitoring and alerting",
        "File integrity monitoring",
        "Automated threat response"
      ],
      useCases: [
        "Monitor website integrity",
        "Detect malware infections",
        "Prevent website defacement",
        "Maintain brand reputation"
      ]
    },
    {
      id: 7,
      title: "Port & Service Scanner",
      icon: Network,
      description: "Discover and secure network services with comprehensive port scanning, service version identification, vulnerability mapping, and access control testing.",
      businessImpact: "Reduce attack surface, secure network perimeter",
      features: [
        "Comprehensive port scanning and service detection",
        "Service version identification",
        "Vulnerability mapping for discovered services",
        "Network access control testing",
        "Service banner analysis"
      ],
      useCases: [
        "Discover network services",
        "Identify service versions",
        "Map service vulnerabilities",
        "Test access controls"
      ]
    }
  ]
  
  return (
    <section 
      ref={sectionRef}
      className="min-h-screen text-white py-20 px-6 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <div className="lg:max-w-5xl">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
              Seven Specialized <span className="text-orange-500">Security Modules</span>
              <br />
              Complete Protection Coverage
            </h2>
            <p className="text-white/80 text-xl leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Meet CyberIx - Your Complete Cybersecurity Command Center. Our AI-powered platform provides comprehensive security scanning across your entire digital infrastructure.
            </p>
          </div>

          {/* Geometric Icon */}
          <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end lg:mr-8">
            <div className="w-32 h-32 lg:w-40 lg:h-40">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-gray-400 stroke-current"
                fill="none"
                strokeWidth="1"
              >
                {/* Wireframe geometric shape */}
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" />
                <line x1="50" y1="10" x2="50" y2="50" />
                <line x1="50" y1="50" x2="90" y2="30" />
                <line x1="50" y1="50" x2="90" y2="70" />
                <line x1="50" y1="50" x2="10" y2="70" />
                <line x1="50" y1="50" x2="10" y2="30" />
                <line x1="10" y1="30" x2="90" y2="70" />
                <line x1="90" y1="30" x2="10" y2="70" />
              </svg>
            </div>
          </div>
        </div>

        {/* 7 Core Security Modules */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Module 1: Advanced Phishing Detection */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Fish className="text-orange-400 w-5 h-5" />
                </div>
                <div className="text-orange-400 text-xs font-medium px-2 py-1 bg-orange-500/10 rounded-full" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Module 1
                </div>
              </div>
              <h3 className="text-white text-lg font-semibold mb-3 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Advanced Phishing Detection
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Protect against sophisticated phishing attacks with AI-powered analysis
              </p>
              <button 
                onClick={() => setSelectedModule(modules[0])}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
              >
                Learn More
              </button>
            </div>

            {/* Module 2: API Security Scanner */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Plug className="text-orange-400 w-5 h-5" />
                </div>
                <div className="text-orange-400 text-xs font-medium px-2 py-1 bg-orange-500/10 rounded-full" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Module 2
                </div>
              </div>
              <h3 className="text-white text-lg font-semibold mb-3 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                API Security Scanner
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Secure your API infrastructure with comprehensive endpoint discovery
              </p>
              <button 
                onClick={() => setSelectedModule(modules[1])}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
              >
                Learn More
              </button>
            </div>

            {/* Module 3: Website Security Analyzer */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '300ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="text-orange-400 w-5 h-5" />
                </div>
                <div className="text-orange-400 text-xs font-medium px-2 py-1 bg-orange-500/10 rounded-full" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Module 3
                </div>
              </div>
              <h3 className="text-white text-lg font-semibold mb-3 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Website Security Analyzer
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Comprehensive web application security assessment and vulnerability detection
              </p>
              <button 
                onClick={() => setSelectedModule(modules[2])}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
              >
                Learn More
              </button>
            </div>

            {/* Module 4: Network Security Scanner */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Search className="text-orange-400 w-5 h-5" />
                </div>
                <div className="text-orange-400 text-xs font-medium px-2 py-1 bg-orange-500/10 rounded-full" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Module 4
                </div>
              </div>
              <h3 className="text-white text-lg font-semibold mb-3 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Network Security Scanner
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Map and secure your network infrastructure with topology discovery
              </p>
              <button 
                onClick={() => setSelectedModule(modules[3])}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
              >
                Learn More
              </button>
            </div>

            {/* Module 5: Server Security Assessment */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '500ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Monitor className="text-orange-400 w-5 h-5" />
                </div>
                <div className="text-orange-400 text-xs font-medium px-2 py-1 bg-orange-500/10 rounded-full" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Module 5
                </div>
              </div>
              <h3 className="text-white text-lg font-semibold mb-3 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Server Security Assessment
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Comprehensive server hardening with OS vulnerability scanning
              </p>
              <button 
                onClick={() => setSelectedModule(modules[4])}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
              >
                Learn More
              </button>
            </div>

            {/* Module 6: Malware & Defacement Monitor */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '600ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="text-orange-400 w-5 h-5" />
                </div>
                <div className="text-orange-400 text-xs font-medium px-2 py-1 bg-orange-500/10 rounded-full" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Module 6
                </div>
              </div>
              <h3 className="text-white text-lg font-semibold mb-3 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Malware & Defacement Monitor
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Continuous monitoring for malicious changes and real-time threat detection
              </p>
              <button 
                onClick={() => setSelectedModule(modules[5])}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
              >
                Learn More
              </button>
            </div>

            {/* Module 7: Port & Service Scanner */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 lg:col-start-2" style={{ transitionDelay: '700ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Network className="text-orange-400 w-5 h-5" />
                </div>
                <div className="text-orange-400 text-xs font-medium px-2 py-1 bg-orange-500/10 rounded-full" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                  Module 7
                </div>
              </div>
              <h3 className="text-white text-lg font-semibold mb-3 leading-tight" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Port & Service Scanner
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                Discover and secure network services with comprehensive port scanning
              </p>
              <button 
                onClick={() => setSelectedModule(modules[6])}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* CTA Callout */}
        <div className="text-center mt-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '800ms' }}>
          
          <a 
            href="/register"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto max-w-[420px] mx-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
            style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
          >
            Fix Threats Automatically Today
          </a> 
        </div>
        <div className="text-center mt-8 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: '900ms' }}>
        <p className="text-white/90 text-lg lg:text-xl mb-0" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
            Stay Secure. Stay Ahead. One Scan at a Time
          </p>
        </div>
        

      </div>

      {/* Module Detail Popup */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-orange-500/30 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
                  <selectedModule.icon className="text-orange-400 w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                    {selectedModule.title}
                  </h3>
                  <p className="text-orange-400 text-lg" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>
                    {selectedModule.businessImpact}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedModule(null)}
                className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-8">
              <p className="text-white/90 text-xl leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                {selectedModule.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-orange-400 text-xl font-semibold mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  Key Features
                </h4>
                <ul className="space-y-3">
                  {selectedModule.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span className="text-white/80" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-orange-400 text-xl font-semibold mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  Use Cases
                </h4>
                <ul className="space-y-3">
                  {selectedModule.useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-3 mt-1">•</span>
                      <span className="text-white/80" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                        {useCase}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <a 
                href="/register"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
              >
                Try This Module
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
