'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product, ViewMode } from '../types/product.types'
import { formatPrice } from '../utils/product.utils'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  viewMode?: ViewMode
  onQuickView?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isWishlisted?: boolean
  className?: string
}

export function ProductCard({
  product,
  viewMode = 'grid',
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  className
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Use the second image for hover effect, fallback to first image if no second image
  const hoverImage = product.images && product.images.length > 1 
    ? product.images[1] 
    : product.image

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('🛒 Adding to cart:', product.title)
    onAddToCart?.(product)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('❤️ Toggling wishlist:', product.title)
    onToggleWishlist?.(product)
  }

  return (
    <div
      className={cn(
        "group cursor-pointer bg-white",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-gray-50">
        <Image
          src={isHovered ? hoverImage : product.image || "/placeholder.svg"}
          alt={product.title}
          width={300}
          height={400}
          className="w-full h-80 object-cover transition-all duration-500 ease-in-out"
        />
        
        {/* Favorite Icon - appears on hover at top-right */}
        <div className={cn(
          "absolute top-3 right-3 transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          {onToggleWishlist && (
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
              onClick={handleToggleWishlist}
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                )}
              />
            </Button>
          )}
        </div>

        {/* Add to Cart Icon - appears on hover at bottom-right */}
        <div className={cn(
          "absolute bottom-3 right-3 transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          {onAddToCart && (
            <Button
              size="icon"
              className="w-10 h-10 bg-black hover:bg-gray-800 text-white shadow-md"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="bg-gray-900 text-white px-4 py-2 text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="pt-4 pb-2">
        <h3 className="text-sm font-medium text-black mb-2 leading-tight">
          {product.title}
        </h3>
        
        <p className="text-sm font-medium text-black">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  )
}
