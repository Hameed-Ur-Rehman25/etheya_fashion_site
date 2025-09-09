'use client'

import { useState } from 'react'
import { useWishlist } from '../context/WishlistContext'
import { useBuyNow } from '../context/BuyNowContext'
import Image from 'next/image'
import { Heart, Plus, CreditCard } from 'lucide-react'
import { Button } from '@/src/shared/components/ui/button'
import { Product } from '@/types'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface SimpleProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  onClick?: (product: Product) => void
  isWishlisted?: boolean
  className?: string
}

export function SimpleProductCard({
  product,
  onAddToCart,
  onClick,
  className
}: SimpleProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { setBuyNowItem } = useBuyNow();
  const router = useRouter();
  
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
    e.stopPropagation();
    toggleWishlist(product);
  }

  const handleCardClick = () => {
    console.log('🔍 Card clicked:', product.title)
    onClick?.(product)
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0];
    setBuyNowItem(product, 1, defaultSize);
    router.push('/delivery-details');
  };

  return (
    <div
      className={cn(
        "group cursor-pointer bg-white",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-gray-50 w-full h-64 sm:w-60 sm:h-96">
        <Image
          src={isHovered ? hoverImage : product.image || "/placeholder.svg"}
          alt={product.title}
          width={200}
          height={400}
          className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out"
        />
        
        {/* Favorite Icon - positioned at top-right within image */}
        <div className={cn(
          "absolute top-3 right-3 transition-all duration-300",
          "md:opacity-0 md:group-hover:opacity-100 opacity-100 translate-y-0"
        )}>
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md rounded-full"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isWishlisted(product.id) ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
              )}
            />
          </Button>
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
      <div className="pt-2 pb-1 sm:pt-4 sm:pb-2 w-full sm:w-60 text-center">
        <h3 className="text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2 leading-tight px-1 sm:px-2 break-words">
          {product.title}
        </h3>
        
        <p className="text-xs sm:text-sm font-medium text-black">
          {product.price}
        </p>
      </div>
    </div>
  )
}
