"use client"

import { Shield, Clock, TrendingUp, Download, Zap } from "lucide-react"
import './radar-animation.css'
import { useRegistration } from "@/components/registration-context"

export function WhyChooseUsSection() {
  const { openModal } = useRegistration()
  
  return (
    <section 
        className="py-20 px-6 relative overflow-hidden"
        style={{
          backgroundImage: "url('/hero/middle-0.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-orange-500/20 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-12 h-12 border-2 border-orange-500/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 border-2 border-orange-500/15 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-60 right-10 w-14 h-14 border-2 border-orange-500/25 rotate-12 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
          4 ways <span className="text-orange-500">Cyberix </span>transforms your security operations
          </h2>
        </div>

        {/* Circular Diagram - Desktop only */}
        <div className="relative hidden lg:flex items-center justify-center min-h-[600px]">
          {/* Radar Video Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover rounded-full opacity-30"
            >
              <source src="/radar.mp4" type="video/mp4" />
            </video>
          </div>
          
          {/* Central Glow */}
          <div className="absolute w-32 h-32 bg-orange-500/30 rounded-full blur-xl animate-pulse"></div>
          
           {/* Enhanced Radar Animation Layers */}
           <div className="absolute inset-0 flex items-center justify-center">
            
            {/* Inner radar waves - darker and faster with smooth easing */}
            <div 
              className="absolute w-24 h-24 border-2 border-orange-800/80 rounded-full"
              style={{ 
                animation: 'radarPulse 2s ease-in-out infinite',
                animationDelay: '0s'
              }}
            ></div>
            <div 
              className="absolute w-40 h-40 border-2 border-orange-700/70 rounded-full"
              style={{ 
                animation: 'radarPulse 2.2s ease-in-out infinite',
                animationDelay: '0.3s'
              }}
            ></div>
            <div 
              className="absolute w-56 h-56 border-2 border-orange-600/60 rounded-full"
              style={{ 
                animation: 'radarPulse 2.4s ease-in-out infinite',
                animationDelay: '0.6s'
              }}
            ></div>
            
            {/* Middle radar waves - medium darkness with smooth transitions */}
            <div 
              className="absolute w-72 h-72 border border-orange-500/50 rounded-full"
              style={{ 
                animation: 'radarPulse 2.6s ease-in-out infinite',
                animationDelay: '0.9s'
              }}
            ></div>
            <div 
              className="absolute w-88 h-88 border border-orange-400/40 rounded-full"
              style={{ 
                animation: 'radarPulse 2.8s ease-in-out infinite',
                animationDelay: '1.2s'
              }}
            ></div>
            
            {/* Outer radar waves - lighter and slower with smooth fade */}
            <div 
              className="absolute w-96 h-96 border border-orange-300/30 rounded-full"
              style={{ 
                animation: 'radarPulse 3s ease-in-out infinite',
                animationDelay: '1.5s'
              }}
            ></div>
            <div 
              className="absolute w-112 h-112 border border-orange-200/20 rounded-full"
              style={{ 
                animation: 'radarPulse 3.2s ease-in-out infinite',
                animationDelay: '1.8s'
              }}
            ></div>
            <div 
              className="absolute w-128 h-128 border border-orange-100/10 rounded-full"
              style={{ 
                animation: 'radarPulse 3.4s ease-in-out infinite',
                animationDelay: '2.1s'
              }}
            ></div>
            
          </div>
          
          {/* Central Icon */}
          <div className="relative w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl z-10">
            <Shield className="w-12 h-12 text-white" />
          </div>

          {/* Four Cards around the center - closer to shield */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-500/30 hover:border-orange-400/70 hover:scale-110 transition-all duration-300 w-80 shadow-lg hover:shadow-orange-500/20">
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 text-orange-400 mr-4" />
                <h3 className="text-white font-semibold text-2xl" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>2 mins</h3>
              </div>
              <p className="text-white/80 text-base" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>to the first vulnerability detection</p>
              <div className="mt-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-400 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Ready</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-500/30 hover:border-orange-400/70 hover:scale-110 transition-all duration-300 w-80 shadow-lg hover:shadow-orange-500/20">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 text-orange-400 mr-4" />
                <h3 className="text-white font-semibold text-2xl" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>99%</h3>
              </div>
              <p className="text-white/80 text-base" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>automated remediation coverage</p>
              <div className="mt-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-400 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Ready</span>
              </div>
            </div>
          </div>

          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 translate-x-16">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-500/30 hover:border-orange-400/70 hover:scale-110 transition-all duration-300 w-80 shadow-lg hover:shadow-orange-500/20">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 text-orange-400 mr-4" />
                <h3 className="text-white font-semibold text-2xl" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>50%</h3>
              </div>
              <p className="text-white/80 text-base" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>Cost reduction versus piecemeal tools</p>
              <div className="mt-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-400 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Ready</span>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-16">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-500/30 hover:border-orange-400/70 hover:scale-110 transition-all duration-300 w-80 shadow-lg hover:shadow-orange-500/20">
              <div className="flex items-center mb-4">
                <Download className="w-8 h-8 text-orange-400 mr-4" />
                <h3 className="text-white font-semibold text-2xl" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>1-click</h3>
              </div>
              <p className="text-white/80 text-base" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>export of reports in any format</p>
              <div className="mt-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-400 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Ready</span>
              </div>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Lines from center to cards */}
            <div className="absolute top-1/2 left-1/2 w-px h-16 bg-gradient-to-t from-orange-500/50 to-transparent transform -translate-x-1/2 -translate-y-8"></div>
            <div className="absolute top-1/2 left-1/2 w-px h-16 bg-gradient-to-b from-orange-500/50 to-transparent transform -translate-x-1/2 translate-y-8"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-px bg-gradient-to-r from-orange-500/50 to-transparent transform -translate-y-1/2 translate-x-16"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-px bg-gradient-to-l from-orange-500/50 to-transparent transform -translate-y-1/2 -translate-x-16"></div>
          </div>
        </div>

        {/* Mobile/Tablet simplified layout - no scanning visuals */}
        <div className="lg:hidden">
          <div className="space-y-8">
            {/* Card 1: Slide from left */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-500/30 transition-all duration-300 w-full shadow-lg animate-slide-left">
              <div className="flex items-center mb-3">
                <Clock className="w-7 h-7 text-orange-400 mr-3" />
                <h3 className="text-white font-semibold text-xl" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>2 mins</h3>
              </div>
              <p className="text-white/80 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>to the first vulnerability detection</p>
              <div className="mt-3 flex items-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-400 text-xs" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Ready</span>
              </div>
            </div>

            {/* Card 2: Slide from right */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-500/30 transition-all duration-300 w-full shadow-lg animate-slide-right">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-7 h-7 text-orange-400 mr-3" />
                <h3 className="text-white font-semibold text-xl" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>99%</h3>
              </div>
              <p className="text-white/80 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>automated remediation coverage</p>
              <div className="mt-3 flex items-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-400 text-xs" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Ready</span>
              </div>
            </div>

            {/* Card 3: Slide from left */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-500/30 transition-all duration-300 w-full shadow-lg animate-slide-left">
              <div className="flex items-center mb-3">
                <Zap className="w-7 h-7 text-orange-400 mr-3" />
                <h3 className="text-white font-semibold text-xl" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>50%</h3>
              </div>
              <p className="text-white/80 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>Cost reduction versus piecemeal tools</p>
              <div className="mt-3 flex items-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-400 text-xs" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Ready</span>
              </div>
            </div>

            {/* Card 4: Slide from right */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-orange-500/30 transition-all duration-300 w-full shadow-lg animate-slide-right">
              <div className="flex items-center mb-3">
                <Download className="w-7 h-7 text-orange-400 mr-3" />
                <h3 className="text-white font-semibold text-xl" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>1-click</h3>
              </div>
              <p className="text-white/80 text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>export of reports in any format</p>
              <div className="mt-3 flex items-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-400 text-xs" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '500' }}>Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-500 hover:scale-105 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}>
              Ready to Transform Your Security?
            </h3>
            <p className="text-white/90 mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
              Join thousands of organizations already securing their networks with Cyberix
            </p>
            <a 
              href="/register"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
            >
              Start Your Free Trial
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
