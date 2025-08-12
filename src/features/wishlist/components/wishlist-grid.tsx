'use client'

import { WishlistItem } from '../types/wishlist.types'
import { ProductCard } from '../../products/components/product-card'
import { Product } from '../../products/types/product.types'
import { cn } from '@/lib/utils'
import { Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WishlistGridProps {
  items: WishlistItem[]
  onRemoveItem: (productId: number) => void
  onAddToCart: (product: Product) => void
  onToggleWishlist: (product: Product) => void
  loading?: boolean
  className?: string
  columns?: number
}

export function WishlistGrid({
  items,
  onRemoveItem,
  onAddToCart,
  onToggleWishlist,
  loading = false,
  className,
  columns = 3
}: WishlistGridProps) {
  const getGridColumns = () => {
    const columnMap = {
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }
    return columnMap[columns as keyof typeof columnMap] || columnMap[3]
  }

  if (loading) {
    return (
      <div className={cn(
        "grid gap-6",
        getGridColumns(),
        className
      )}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <Heart className="w-full h-full" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Save items you love to your wishlist. Review them anytime and easily move them to your bag.
          </p>
          <Button 
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => window.location.href = '/products'}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "grid gap-6",
      getGridColumns(),
      className
    )}>
      {items.map((item) => (
        <ProductCard
          key={item.id}
          product={item.product}
          viewMode="grid"
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={true}
        />
      ))}
    </div>
  )
}
