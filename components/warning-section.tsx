"use client"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { useRegistration } from "@/components/registration-context"

export function WarningSection() {
  const { openModal } = useRegistration()
  return (
    <section 
      id="warning"
      className="min-h-screen flex items-center justify-center py-32 px-4"
      style={{
        backgroundImage: "url('/hero/middle-0.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <div 
          className="backdrop-blur-sm border border-white/20 rounded-3xl p-12 text-center"
          style={{
            backgroundImage: "url('/hero/getin-Section.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
           <div className="flex justify-center mb-6">
             <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
               <Shield className="w-8 h-8 text-white" />
             </div>
           </div>
           
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
             Don't Wait Until It's <span className="text-orange-500">Too Late</span>
           </h2>
           
           <p className="text-white/90 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
             Cyber threats evolve every second. Delaying protection means risking costly breaches and downtime.
           </p>
           
           <a
             href="/register"
             className="inline-block bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto max-w-[400px] mx-auto px-12 py-6 text-xl font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 cursor-pointer"
             style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '600' }}
           >
            Protect My Business Now
           </a>
        </div>
      </div>
    </section>
  )
}
