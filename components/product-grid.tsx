'use client'

import { Product, ViewMode } from '@/types'
import { ProductCard } from './product-card'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
  viewMode?: ViewMode
  onQuickView?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  wishlistedIds?: Set<number>
  className?: string
  emptyStateMessage?: string
  loading?: boolean
}

export function ProductGrid({
  products,
  viewMode = 'grid',
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistedIds = new Set(),
  className,
  emptyStateMessage = "No products found",
  loading = false
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={cn(
        "grid gap-6",
        viewMode === 'grid' 
          ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1",
        className
      )}>
        {Array.from({ length: 6 }).map((_, i) => (
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
            // Mobile: 2 columns, tighter gap, padding
            "grid gap-3 px-2 grid-cols-2",
            // Tablet/Desktop: restore original spacing and columns
            "sm:gap-6 sm:px-0 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3",
            viewMode !== 'grid' && "grid-cols-1 sm:grid-cols-1",
            className
          )}
        >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={wishlistedIds.has(product.id)}
        />
      ))}
    </div>
  )
}
