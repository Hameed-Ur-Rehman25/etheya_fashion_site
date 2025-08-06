'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Hero background with models in South Asian clothing"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
          Elegance Redefined
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Discover our exquisite collection of modern South Asian fashion
        </p>
        
        {/* Animated Shop Now Button */}
        <Button
          size="lg"
          className="fill-button bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-medium transition-all duration-300"
        >
          Shop Now
        </Button>
      </div>
    </section>
  )
}
