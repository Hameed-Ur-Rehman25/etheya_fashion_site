'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';

// Hero data interface and configuration
interface HeroImage {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  buttonText: string;
  contentPosition: 'left' | 'right';
}

const heroImages: HeroImage[] = [
  {
    src: "/assets/image3.jpeg",
    alt: "Hero background with models in South Asian clothing - Image 1",
    title: "Elegance Redefined",
    subtitle: "Discover our exquisite collection of modern South Asian fashion",
    buttonText: "Shop Now",
    contentPosition: "right"
  },
  {
    src: "/assets/image2.png", 
    alt: "Hero background with models in South Asian clothing - Image 2",
    title: "Timeless Beauty",
    subtitle: "Experience the perfect blend of tradition and contemporary style",
    buttonText: "Explore Collection",
    contentPosition: "left"
  }
];

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [textKey, setTextKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Auto-play only after mounting
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentImage((prev) => {
          const newIndex = (prev + 1) % heroImages.length;
          setTextKey(prevKey => prevKey + 1);
          return newIndex;
        });
      }, 10000);

      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleImageSelect = (index: number) => {
    if (!mounted) return;
    setCurrentImage(index);
    setTextKey(prevKey => prevKey + 1);
  };

  // Use first image for SSR, current for client
  const displayImage = heroImages[mounted ? currentImage : 0];

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src={displayImage.src}
            alt={displayImage.alt}
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      {/* Content - Render differently for SSR vs Client */}
      <div className={`relative z-10 text-left text-black px-8 md:px-16 lg:px-24 max-w-2xl ${
        displayImage.contentPosition === 'right' 
          ? 'ml-auto' 
          : ''
      }`}>
        {!mounted ? (
          // SSR version - no animations, no key changes
          <div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              {displayImage.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              {displayImage.subtitle}
            </p>
            
            <Button
              size="lg"
              className="fill-button bg-transparent border-2 border-black text-black px-8 py-3 text-lg font-medium transition-all duration-300"
            >
              {displayImage.buttonText}
            </Button>
          </div>
        ) : (
          // Client version - with animations
          <div 
            key={textKey}
            className="animate-fade-in-up"
          >
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight animate-fade-in-up">
              {displayImage.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up">
              {displayImage.subtitle}
            </p>
            
            <Button
              size="lg"
              className="fill-button bg-transparent border-2 border-black text-black px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
            >
              {displayImage.buttonText}
            </Button>
          </div>
        )}
      </div>

      {/* Slide Indicators - Only show after mounting */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {mounted && heroImages.length > 1 && heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleImageSelect(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentImage === index ? 'bg-black' : 'bg-black bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
