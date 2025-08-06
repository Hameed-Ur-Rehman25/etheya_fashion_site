'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductModal } from './product-modal'
import { SectionContainer } from './section-container'
import { PRODUCTS } from '@/lib/constants'
import { Product } from '@/types'

export function NewArrivalsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Use the first 5 products as new arrivals
  const products = PRODUCTS.slice(0, 5)
  const itemsPerView = 4

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= products.length ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, products.length - itemsPerView) : prev - 1
    )
  }

  return (
    <>
      <SectionContainer background="gray" padding="xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
            New Arrivals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest additions to our collection, featuring contemporary designs 
            and timeless elegance
          </p>
        </div>
        
        <div className="relative">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl"
            onClick={nextSlide}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Product Cards */}
          <div className="overflow-hidden mx-12">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-1/4 flex-shrink-0 px-4"
                >
                  <div className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white rounded-lg overflow-hidden">
                    <div className="relative overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        width={300}
                        height={400}
                        className="object-cover w-full h-80 group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Featured Badge */}
                      {product.featured && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
                          New
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{product.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                      <p className="text-xl font-bold text-gray-900 mb-4">{product.price}</p>
                      
                      <Button
                        onClick={() => setSelectedProduct(product)}
                        className="w-full bg-transparent border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
                      >
                        View Product
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}
