'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DatabaseService } from '@/lib/database-service';

// Hero data interface and configuration
interface HeroImage {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  buttonText: string;
  contentPosition: 'left' | 'right';
}

// Fallback hero images in case backend fails
const fallbackHeroImages: HeroImage[] = [
  {
    src: "/assets/image3.jpeg",
    alt: "Hero background with models in South Asian clothing - Image 1",
    title: "Elegance Redefined",
    subtitle: "Discover our exquisite collection of modern South Asian fashion",
    buttonText: "Shop Now",
    contentPosition: "right"
  },
  {
    src: "/assets/image2.jpeg", 
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
  const [heroImages, setHeroImages] = useState<HeroImage[]>(fallbackHeroImages);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Fetch hero images from backend
    const fetchHeroImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await DatabaseService.getHeroImages();
        
        if (fetchError) {
          console.error('Error fetching hero images:', fetchError);
          setError('Failed to load hero images');
          // Use fallback images
          setHeroImages(fallbackHeroImages);
        } else if (data && data.length > 0) {
          setHeroImages(data);
        } else {
          console.warn('No hero images found, using fallback');
          setHeroImages(fallbackHeroImages);
        }
      } catch (err) {
        console.error('Unexpected error fetching hero images:', err);
        setError('Failed to load hero images');
        setHeroImages(fallbackHeroImages);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
    
    // Auto-play only after mounting and images are loaded
    const timer = setTimeout(() => {
      if (heroImages.length > 1) {
        const interval = setInterval(() => {
          setCurrentImage((prev) => {
            const newIndex = (prev + 1) % heroImages.length;
            setTextKey(prevKey => prevKey + 1);
            return newIndex;
          });
        }, 10000);

        return () => clearInterval(interval);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [heroImages.length]);

  const handleImageSelect = (index: number) => {
    if (!mounted) return;
    setCurrentImage(index);
    setTextKey(prevKey => prevKey + 1);
  };

  // Use first image for SSR, current for client
  const displayImage = heroImages[mounted ? currentImage : 0];

  // Show loading state
  if (loading && heroImages === fallbackHeroImages) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hero images...</p>
        </div>
      </section>
    );
  }

  // Show error state if there's an error and no fallback images
  if (error && heroImages.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
  <section className="relative h-[60vh] md:h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
            <Image
              src={displayImage.src}
              alt={displayImage.alt}
              fill
              className="object-cover object-center w-full h-full lg:w-full lg:h-full"
              priority
              quality={85}
              sizes="100vw"
            />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      {/* Content - Render differently for SSR vs Client */}
      <div className={`relative z-10 text-left text-black px-4 sm:px-6 md:px-16 lg:px-24 max-w-2xl ${
        displayImage.contentPosition === 'right' 
          ? 'ml-auto' 
          : ''
      }`}>
        {!mounted ? (
          // SSR version - no animations, no key changes
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-6xl font-playfair font-bold mb-4 md:mb-6 leading-tight">
              {displayImage.title}
            </h1>
            <p className="text-sm sm:text-base md:text-xl mb-6 md:mb-8 opacity-90">
              {displayImage.subtitle}
            </p>
            
            <Link href="/products">
              <Button
                size="sm"
                className="fill-button bg-transparent border-2 border-black text-black px-4 py-2 md:px-8 md:py-3 text-sm md:text-lg font-medium transition-all duration-300"
              >
                {displayImage.buttonText}
              </Button>
            </Link>
          </div>
        ) : (
          // Client version - with animations
          <div 
            key={textKey}
            className="animate-fade-in-up"
          >
            <h1 className="text-2xl sm:text-3xl md:text-6xl font-playfair font-bold mb-4 md:mb-6 leading-tight animate-fade-in-up">
              {displayImage.title}
            </h1>
            <p className="text-sm sm:text-base md:text-xl mb-6 md:mb-8 opacity-90 animate-fade-in-up">
              {displayImage.subtitle}
            </p>
            
            <Link href="/products">
              <Button
                size="sm"
                className="fill-button bg-transparent border-2 border-black text-black px-4 py-2 md:px-8 md:py-3 text-sm md:text-lg font-medium transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
              >
                {displayImage.buttonText}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Slide Indicators - Only show after mounting */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
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
