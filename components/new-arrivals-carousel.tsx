'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductModal } from './product-modal'

const products = [
  {
    id: 1,
    title: 'Embroidered Lawn Suit',
    price: 'Rs. 7,560',
    image: '/placeholder.svg?height=400&width=300',
    description: 'Beautiful embroidered lawn suit perfect for summer occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg?height=400&width=300', '/placeholder.svg?height=400&width=300']
  },
  {
    id: 2,
    title: 'Silk Formal Dress',
    price: 'Rs. 12,500',
    image: '/placeholder.svg?height=400&width=300',
    description: 'Elegant silk formal dress with intricate detailing.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg?height=400&width=300', '/placeholder.svg?height=400&width=300']
  },
  {
    id: 3,
    title: 'Cotton Kurta Set',
    price: 'Rs. 4,200',
    image: '/placeholder.svg?height=400&width=300',
    description: 'Comfortable cotton kurta set for everyday wear.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg?height=400&width=300', '/placeholder.svg?height=400&width=300']
  },
  {
    id: 4,
    title: 'Designer Palazzo Set',
    price: 'Rs. 8,900',
    image: '/placeholder.svg?height=400&width=300',
    description: 'Trendy palazzo set with contemporary design.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg?height=400&width=300', '/placeholder.svg?height=400&width=300']
  },
  {
    id: 5,
    title: 'Chiffon Party Wear',
    price: 'Rs. 15,000',
    image: '/placeholder.svg?height=400&width=300',
    description: 'Stunning chiffon party wear with beadwork.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg?height=400&width=300', '/placeholder.svg?height=400&width=300']
  }
]

export function NewArrivalsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-16 text-gray-900">
            New Arrivals
          </h2>
          
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
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{product.title}</h3>
                        <p className="text-xl font-bold text-gray-900 mb-4">{product.price}</p>
                        
                        <Button
                          onClick={() => setSelectedProduct(product)}
                          className="w-full fill-button bg-transparent border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
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
