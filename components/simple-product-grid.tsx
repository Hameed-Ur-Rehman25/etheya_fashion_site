'use client'

import { Product } from '@/types'
import { SimpleProductCard } from './simple-product-card'
import { cn } from '@/lib/utils'

interface SimpleProductGridProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  onClick?: (product: Product) => void
  wishlistedIds?: Set<number>
  className?: string
  emptyStateMessage?: string
  loading?: boolean
  columns?: number
}

export function SimpleProductGrid({
  products,
  onAddToCart,
  onToggleWishlist,
  onClick,
  wishlistedIds = new Set(),
  className,
  emptyStateMessage = "No products found",
  loading = false,
  columns = 4
}: SimpleProductGridProps) {
  
  // Generate grid columns class based on columns prop
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
  }

  if (loading) {
    return (
      <div className={cn(
        "grid gap-6",
        gridCols[columns as keyof typeof gridCols] || gridCols[4],
        className
      )}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🛍️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyStateMessage}
        </h3>
        <p className="text-gray-600">
          Try adjusting your search or filter criteria
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        gridCols[columns as keyof typeof gridCols] || gridCols[4],
        className
      )}
    >
      {products.map((product) => (
        <SimpleProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onClick={onClick}
          isWishlisted={wishlistedIds.has(product.id)}
        />
      ))}
    </div>
  )
}
