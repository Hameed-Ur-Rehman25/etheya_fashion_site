'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Product {
  id: number
  title: string
  price: string
  image: string
  description: string
  sizes: string[]
  images: string[]
}

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative">
            <div className="relative h-96 md:h-full">
              <Image
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Close Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Details */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-playfair font-bold text-gray-900">{product.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            <p className="text-3xl font-bold text-gray-900 mb-6">{product.price}</p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
            
            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={`w-12 h-12 ${
                      selectedSize === size 
                        ? 'bg-gray-900 text-white' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-900'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full fill-button bg-gray-900 text-white hover:bg-gray-800 py-3 text-lg font-medium"
              disabled={!selectedSize}
            >
              Add to Cart
            </Button>
            
            {!selectedSize && (
              <p className="text-sm text-gray-500 mt-2 text-center">Please select a size</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
