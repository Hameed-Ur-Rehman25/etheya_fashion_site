'use client'

import { Product, ViewMode } from '../types/product.types'
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
  columns?: number
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
  loading = false,
  columns = 3
}: ProductGridProps) {
  // Generate grid columns class based on columns prop and view mode
  const getGridColumns = () => {
    if (viewMode === 'list') return "grid-cols-1"
    
    const columnMap = {
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
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
        {Array.from({ length: columns * 2 }).map((_, i) => (
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

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a2 2 0 00-2-2H9a2 2 0 00-2 2v1M4 13v-1a1 1 0 011-1h1m13 1v-1a1 1 0 011-1h1m-6 7l-3-3-3 3"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyStateMessage}
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        getGridColumns(),
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
