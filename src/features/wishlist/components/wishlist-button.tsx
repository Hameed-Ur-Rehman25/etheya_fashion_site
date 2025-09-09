'use client'

import React from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/src/shared/components/ui/button'
import { Product } from '../../products/types/product.types'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  product: Product
  isWishlisted: boolean
  onToggle: (product: Product) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'text' | 'floating'
  loading?: boolean
}

export function WishlistButton({
  product,
  isWishlisted,
  onToggle,
  className,
  size = 'md',
  variant = 'icon',
  loading = false
}: WishlistButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggle(product)
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  if (variant === 'floating') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200",
          "group-hover:scale-110 transform",
          loading && "opacity-50 cursor-not-allowed",
          className
        )}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={cn(
            iconSizes[size],
            "transition-colors duration-200",
            isWishlisted 
              ? "fill-red-500 text-red-500" 
              : "text-gray-400 hover:text-red-500"
          )}
        />
      </button>
    )
  }

  if (variant === 'text') {
    return (
      <Button
        onClick={handleClick}
        disabled={loading}
        variant={isWishlisted ? "default" : "outline"}
        size={size === 'md' ? 'default' : size}
        className={cn(
          "gap-2",
          isWishlisted && "bg-red-500 hover:bg-red-600 text-white",
          className
        )}
      >
        <Heart
          className={cn(
            iconSizes[size],
            isWishlisted && "fill-current"
          )}
        />
        {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
      </Button>
    )
  }

  // Default icon variant
  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      variant="ghost"
      size="icon"
      className={cn(
        sizeClasses[size],
        "rounded-full hover:bg-gray-100 transition-colors",
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-colors duration-200",
          isWishlisted 
            ? "fill-red-500 text-red-500" 
            : "text-gray-400 hover:text-red-500"
        )}
      />
    </Button>
  )
}
