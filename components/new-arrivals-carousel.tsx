'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { Button } from '@/src/shared/components/ui/button'
import { ProductModal } from './product-modal'
import { SectionContainer } from './section-container'
import { Product } from '@/types'
import { Lens } from '@/src/shared/components/ui/lens'
import { useProductCache } from '@/context/ProductCacheContext'

export function NewArrivalsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Use cached products
  const { products: allProducts, loading } = useProductCache()
  
  // Use the first 5 products as new arrivals
  const products = allProducts.slice(0, 5)

  const nextSlide = () => {
    if (products.length === 0) return
    setCurrentIndex((prev) => 
      prev + 1 >= products.length ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    if (products.length === 0) return
    setCurrentIndex((prev) => 
      prev === 0 ? products.length - 1 : prev - 1
    )
  }

  const currentProduct = products[currentIndex]

  // Show loading state
  if (loading) {
    return (
      <section className="relative py-12 md:py-16 px-6 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: 'url(/assets/bg1.png)', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-gray-800 max-w-2xl mx-auto">
              Loading latest products...
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Show empty state if no products
  if (products.length === 0) {
    return (
      <section className="relative py-12 md:py-16 px-6 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: 'url(/assets/bg1.png)', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-gray-800 max-w-2xl mx-auto">
              No products available at the moment
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section
        className="relative py-12 px-2 md:py-20 md:px-6 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: 'url(/assets/bg1.png)', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-playfair font-bold text-gray-900 mb-3 md:mb-4">
              New Arrivals
            </h2>
            <p className="text-gray-800 max-w-md md:max-w-2xl mx-auto text-sm md:text-base">
              Discover the latest additions to our collection, featuring contemporary designs
              and timeless elegance
            </p>
          </div>

          <div className="relative max-w-md md:max-w-6xl mx-auto">
            {/* Navigation Arrows - mobile: below image, desktop: sides */}
            <div className="flex md:block justify-center md:justify-start gap-4 md:gap-0 w-full md:w-auto mt-4 md:mt-0">
              <Button
                variant="outline"
                size="icon"
                className="bg-white shadow-lg hover:shadow-xl rounded-full w-10 h-10 md:absolute md:left-4 md:top-1/2 md:-translate-y-1/2 z-10"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white shadow-lg hover:shadow-xl rounded-full w-10 h-10 md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2 z-10"
                onClick={nextSlide}
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>

            {/* Single Product Display */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 px-2 md:px-16">
              {/* Images Section */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full justify-center items-center">
                {/* Large Image */}
                <div className="relative group w-full md:w-auto">
                  <div className="relative overflow-hidden rounded-lg bg-white shadow-lg mx-auto w-full max-w-xs md:max-w-none">
                    <Lens zoomFactor={1.8} lensSize={160}>
                      <Image
                        src={currentProduct.image}
                        alt={currentProduct.title}
                        width={320}
                        height={400}
                        className="object-cover w-full h-[320px] md:w-[500px] md:h-[600px] group-hover:scale-105 transition-transform duration-500"
                      />
                    </Lens>

                    {/* Wishlist Button */}
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full z-30"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Small Image with Product Details - only show on desktop */}
                <div className="hidden md:flex md:w-52 flex-col mt-4 md:mt-0">
                  <div className="relative overflow-hidden rounded-lg bg-white shadow-md mb-4 md:mb-6 mx-auto w-full max-w-[180px] md:max-w-none">
                    <Lens zoomFactor={1.6} lensSize={120}>
                      <Image
                        src={currentProduct.images && currentProduct.images.length > 1 ? currentProduct.images[1] : currentProduct.image}
                        alt={`${currentProduct.title} - view 2`}
                        width={180}
                        height={220}
                        className="object-cover w-full h-[180px] md:h-[280px] hover:scale-105 transition-transform duration-300"
                      />
                    </Lens>
                  </div>

                  {/* Product Details Section - Under Small Image */}
                  <div className="text-left px-0">
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
              {/* Product Details Section - show below image on mobile */}
              <div className="block md:hidden w-full mt-2">
                <div className="text-center px-2">
                  {/* Category */}
                  {currentProduct.category && (
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
                      {currentProduct.category}
                    </p>
                  )}
                  {/* Product Title */}
                  <h3 className="text-base font-playfair font-bold text-gray-900 mb-1 leading-tight">
                    {currentProduct.title}
                  </h3>
                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                    {currentProduct.description}
                  </p>
                  {/* Price */}
                  <p className="text-lg font-bold text-gray-900 mb-3">
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
                    <span className="relative z-20 text-xs">View Product</span>
                  </Button>
                  {/* Availability */}
                  <p className="text-xs text-gray-500 mt-2">
                    {currentProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-6 md:mt-8 space-x-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
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
