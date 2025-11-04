"use client"

import { useEffect, useState } from "react"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from "@/lib/utils"

interface AuthCarouselProps {
  className?: string
}

const carouselSlides = [
  {
    title: "Protecting Businesses, Securing Futures",
    subtitle: "Enterprise-grade cybersecurity solutions",
    image: "/hero/middle-1.png",
    gradient: "from-orange-900/90 via-orange-800/70 to-black/95"
  },
  {
    title: "AI-Powered Threat Detection",
    subtitle: "Real-time security monitoring and automated response",
    image: "/hero/middle-1.png",
    gradient: "from-orange-900/90 via-orange-800/70 to-black/95"
  },
  {
    title: "24/7 Security Monitoring",
    subtitle: "Round-the-clock protection for your digital assets",
    image: "/hero/middle-1.png",
    gradient: "from-orange-900/90 via-orange-800/70 to-black/95"
  },
  {
    title: "Compliance & Risk Management",
    subtitle: "Stay compliant with industry standards and regulations",
    image: "/hero/middle-1.png",
    gradient: "from-orange-900/90 via-orange-800/70 to-black/95"
  }
]

export function AuthCarousel({ className }: AuthCarouselProps) {
  const [api, setApi] = useState<ReturnType<typeof useEmblaCarousel>[1]>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  )

  useEffect(() => {
    if (!emblaApi) return
    setApi(emblaApi)
  }, [emblaApi])

  useEffect(() => {
    if (!api) return

    setSelectedIndex(api.selectedScrollSnap())
    api.on('select', () => {
      setSelectedIndex(api.selectedScrollSnap())
    })

    return () => {
      api.off('select', () => {})
    }
  }, [api])

  return (
    <div className={cn("relative w-full h-full overflow-hidden rounded-l-2xl", className)}>
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {carouselSlides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('${slide.image}')`,
                }}
              >
                {/* Gradient Overlay */}
                <div className={cn("absolute inset-0 bg-gradient-to-br", slide.gradient)}></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-12">
                {/* Top Section */}
                <div className="flex items-start justify-between">
                  {/* Logo */}
                  <div className="h-12 md:h-16 w-auto flex items-center">
                    <img 
                      src="/Cybersecurity research-01.png" 
                      alt="Cyberix Logo" 
                      className="h-full w-auto brightness-0 invert"
                    />
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col items-center mb-12">
                  {/* Title */}
                  <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center max-w-md" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700' }}>
                    {slide.title}
                  </h2>
                  
                  {/* Subtitle */}
                  <p className="text-white/80 text-base md:text-lg text-center max-w-md mb-8" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '400' }}>
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "w-10 bg-white"
                : "w-10 bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

