'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

// Hero data interface
interface HeroImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  button_text: string;
  content_position: 'left' | 'right';
  active: boolean;
  order_index: number;
}

// Fallback hero images for when Supabase data is not available
const fallbackHeroImages: Omit<HeroImage, 'id' | 'active' | 'order_index'>[] = [
  {
    src: "/assets/image3.jpeg",
    alt: "Hero background with models in South Asian clothing - Image 1",
    title: "Elegance Redefined",
    subtitle: "Discover our exquisite collection of modern South Asian fashion",
    button_text: "Shop Now",
    content_position: "right"
  },
  {
    src: "/assets/image2.png", 
    alt: "Hero background with models in South Asian clothing - Image 2",
    title: "Timeless Beauty",
    subtitle: "Experience the perfect blend of tradition and contemporary style",
    button_text: "Explore Collection",
    content_position: "left"
  }
];

export function DynamicHeroSection() {
  const [mounted, setMounted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadHeroImages();
  }, []);

  useEffect(() => {
    if (mounted && heroImages.length > 1) {
      // Auto-play only after mounting and if we have multiple images
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
    }
  }, [mounted, heroImages.length]);

  const loadHeroImages = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setHeroImages(data);
      } else {
        // Use fallback images if no data from Supabase
        const fallbackData: HeroImage[] = fallbackHeroImages.map((img, index) => ({
          ...img,
          id: index + 1,
          active: true,
          order_index: index + 1
        }));
        setHeroImages(fallbackData);
      }
    } catch (error) {
      console.error('Failed to load hero images:', error);
      // Use fallback images on error
      const fallbackData: HeroImage[] = fallbackHeroImages.map((img, index) => ({
        ...img,
        id: index + 1,
        active: true,
        order_index: index + 1
      }));
      setHeroImages(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (index: number) => {
    if (!mounted) return;
    setCurrentImage(index);
    setTextKey(prevKey => prevKey + 1);
  };

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </section>
    );
  }

  if (heroImages.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Etheya Fashion</h1>
          <p className="text-xl text-gray-600">Your hero images will appear here</p>
        </div>
      </section>
    );
  }

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
        displayImage.content_position === 'right' 
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
              {displayImage.button_text}
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
              {displayImage.button_text}
            </Button>
          </div>
        )}
      </div>

      {/* Slide Indicators - Only show after mounting and if multiple images */}
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
