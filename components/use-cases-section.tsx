"use client"

import { Monitor, Search, Building, Code } from "lucide-react"

export function UseCasesSection() {
  return (
    <section 
      className="py-20 px-6"
      style={{
        backgroundImage: "url('/hero/middle-0.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
            Perfect for Every <span className="text-orange-500">Security Need</span>
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left Column - Video */}
          <div className="order-2 lg:order-1 lg:col-span-3 relative flex justify-center">
            {/* Laptop Frame */}
            <div className="relative">
              {/* Laptop Base */}
              <div className="bg-gray-800 rounded-lg p-4 shadow-2xl">
                {/* Laptop Screen */}
                <div className="bg-black rounded-lg p-2 relative">
                  {/* Screen Bezel */}
                  <div className="bg-gray-900 rounded-md p-3">
                    {/* Video Screen */}
                    <div className="relative overflow-hidden rounded-md">
                      <video 
                        className="w-full h-auto" 
                        // controls
                        poster="/placeholder.jpg"
                        loop
                        autoPlay
                        muted
                      >
                        {/* <source src="/video/c1.mp4" type="video/mp4" /> */}
                        {/* <source src="/video/c2.mp4" type="video/mp4" />
                        <source src="/video/c3.mp4" type="video/mp4" /> */}
                        <source src="/video/c3.mov" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      {/* Black Gradient Overlay */}
                      
                    </div>
                  </div>
                </div>
                
                {/* Laptop Keyboard Area */}
                <div className="mt-2 bg-gray-700 rounded-b-lg p-2">
                  <div className="flex justify-center space-x-1">
                    <div className="w-8 h-1 bg-gray-600 rounded"></div>
                    <div className="w-8 h-1 bg-gray-600 rounded"></div>
                    <div className="w-8 h-1 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Laptop Stand/Base */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>

          {/* Right Column - Use Cases Content */}
          <div className="order-1 lg:order-2 lg:col-span-2 space-y-8">
            {/* IT Teams */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Monitor className="text-orange-400 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-orange-400 text-xl font-semibold mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  For IT Teams
                </h3>
                <ul className="text-white/80 text-base space-y-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  <li>• Continuous infrastructure monitoring</li>
                  <li>• Vulnerability management automation</li>
                  <li>• Compliance reporting and documentation</li>
                </ul>
              </div>
            </div>

            {/* Security Consultants */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Search className="text-orange-400 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-orange-400 text-xl font-semibold mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  For Security Consultants
                </h3>
                <ul className="text-white/80 text-base space-y-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  <li>• Professional client assessments</li>
                  <li>• Comprehensive security auditing</li>
                  <li>• White-label reporting capabilities</li>
                </ul>
              </div>
            </div>

            {/* Businesses */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Building className="text-orange-400 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-orange-400 text-xl font-semibold mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  For Businesses
                </h3>
                <ul className="text-white/80 text-base space-y-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  <li>• Brand protection from phishing</li>
                  <li>• Customer data security</li>
                  <li>• Regulatory compliance assurance</li>
                </ul>
              </div>
            </div>

            {/* Developers */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Code className="text-orange-400 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-orange-400 text-xl font-semibold mb-2" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                  For Developers
                </h3>
                <ul className="text-white/80 text-base space-y-1" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                  <li>• API security testing</li>
                  <li>• Application vulnerability scanning</li>
                  <li>• DevSecOps integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              Start Securing Your Digital Assets Today
            </h3>
            <p className="text-white/90 text-xl mb-8" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Join thousands of security professionals who trust CyberIx to protect their organizations. Get started with a free security assessment and discover your vulnerabilities before attackers do.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
                Start Free Security Scan
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}