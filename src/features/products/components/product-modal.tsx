'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Heart, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { Badge } from '@/shared/components/ui/badge'
import { Product } from '@/features/products/types/product.types'
import { formatPrice } from '@/features/products/utils/product.utils'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart?: (product: Product, size?: string) => void
  onToggleWishlist?: (product: Product) => void
  isWishlisted?: boolean
}

export function ProductModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false
}: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      alert('Please select a size')
      return
    }
    onAddToCart?.(product, selectedSize)
    console.log('Adding to cart:', { product, selectedSize })
  }

  const handleWishlistToggle = () => {
    onToggleWishlist?.(product)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative">
            <div className="relative h-96 md:h-full min-h-[400px]">
              <Image
                src={product.images[currentImageIndex] || product.image || "/placeholder.svg"}
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Image Indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex 
                          ? 'bg-white' 
                          : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-900 pr-4">
                  {product.title}
                </h1>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.category && (
                  <Badge variant="secondary">{product.category}</Badge>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                product.inStock ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={`text-sm font-medium ${
                product.inStock ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="min-w-[60px]"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-black text-white hover:bg-gray-800 py-3"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                
                {onToggleWishlist && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className="p-3"
                  >
                    <Heart className={`w-4 h-4 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`} />
                  </Button>
                )}
              </div>
              
              <Button
                variant="outline"
                className="w-full py-3"
                onClick={() => {
                  console.log('Buy now:', product)
                  // TODO: Implement buy now logic
                }}
                disabled={!product.inStock}
              >
                Buy Now
              </Button>
            </div>

            {/* Product Features */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Product Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• High-quality fabric and construction</li>
                <li>• Perfect for various occasions</li>
                <li>• Available in multiple sizes</li>
                <li>• Easy care and maintenance</li>
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Shipping Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Free shipping on orders over Rs. 5,000</li>
                <li>• Delivery within 3-5 business days</li>
                <li>• Easy returns within 30 days</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
