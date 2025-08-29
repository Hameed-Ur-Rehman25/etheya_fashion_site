'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductModal } from './product-modal'
import { SectionContainer } from './section-container'
import { PRODUCTS } from '@/lib/constants'
import { Product } from '@/types'
import { Lens } from '@/components/ui/lens'

export function NewArrivalsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Use the first 5 products as new arrivals
  const products = PRODUCTS.slice(0, 5)

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 1 >= products.length ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? products.length - 1 : prev - 1
    )
  }

  const currentProduct = products[currentIndex]

  return (
    <>
      <section 
        className="relative py-20 px-6 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: 'url(/assets/bg1.png)', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-gray-800 max-w-2xl mx-auto">
              Discover the latest additions to our collection, featuring contemporary designs 
              and timeless elegance
            </p>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Single Product Display */}
          <div className="flex flex-col items-center gap-8 px-16">
            {/* Images Section */}
            <div className="flex gap-8 justify-center">
              {/* Large Image */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
                  <Lens zoomFactor={1.8} lensSize={200}>
                    <Image
                      src="/assets/image3.jpeg"
                      alt={currentProduct.title}
                      width={500}
                      height={600}
                      className="object-cover w-[500px] h-[600px] group-hover:scale-105 transition-transform duration-500"
                    />
                  </Lens>
                  
                  {/* Wishlist Button */}
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full z-30"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  
                  {/* ...removed NEW tag... */}
                </div>
              </div>
              
              {/* Small Image with Product Details */}
              <div className="w-52 flex flex-col">
                <div className="relative overflow-hidden rounded-lg bg-white shadow-md mb-6">
                  <Lens zoomFactor={1.6} lensSize={150}>
                    <Image
                      src="/assets/image3.jpeg"
                      alt={`${currentProduct.title} - view 2`}
                      width={200}
                      height={280}
                      className="object-cover w-full h-[280px] hover:scale-105 transition-transform duration-300"
                    />
                  </Lens>
                </div>
                
                {/* Product Details Section - Under Small Image */}
                <div className="text-left">
                  {/* Category */}
                  {currentProduct.category && (
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      {currentProduct.category}
                    </p>
                  )}
                  
                  {/* Product Title */}
                  <h3 className="text-lg font-playfair font-bold text-gray-900 mb-3 leading-tight">
                    {currentProduct.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {currentProduct.description}
                  </p>
                  
                  {/* Price */}
                  <p className="text-xl font-bold text-gray-900 mb-6">
                    {currentProduct.price}
                  </p>
                  
                  {/* Action Button */}
                  <Button
                    onClick={() => setSelectedProduct(currentProduct)}
                    className="relative w-full px-4 py-2 bg-white text-black border border-gray-900 transition-all duration-300 overflow-hidden
                      before:absolute before:inset-0 before:bg-gray-900 before:translate-x-[-100%] before:transition-transform before:duration-500 before:ease-out
                      hover:before:translate-x-0 hover:text-white hover:border-gray-900 z-10
                      after:absolute after:inset-0 after:bg-white after:translate-x-[100%] after:transition-transform after:duration-500 after:ease-out after:z-[-1]"
                  >
                    <span className="relative z-20 text-sm">View Product</span>
                  </Button>
                  
                  {/* Availability */}
                  <p className="text-xs text-gray-500 mt-3">
                    {currentProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gray-900 scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}
