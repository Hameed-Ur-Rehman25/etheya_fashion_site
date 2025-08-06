'use client'

import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product, ViewMode } from '@/types'
import { formatPrice, truncateText } from '@/lib/product-utils'
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
  const isListView = viewMode === 'list'

  return (
    <div
      className={cn(
        "group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white rounded-lg overflow-hidden border",
        isListView ? "flex" : "",
        className
      )}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden",
        isListView ? "w-48 flex-shrink-0" : ""
      )}>
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          width={300}
          height={400}
          className={cn(
            "object-cover group-hover:scale-105 transition-transform duration-500",
            isListView ? "w-full h-48" : "w-full h-80"
          )}
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            {onQuickView && (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  onQuickView(product)
                }}
                className="bg-white text-black hover:bg-gray-100"
              >
                Quick View
              </Button>
            )}
          </div>
        </div>

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              onToggleWishlist(product)
            }}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </Button>
        )}

        {/* Badges: Out of Stock & Featured */}
        {(product.featured || !product.inStock) && (
          <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
            {!product.inStock && (
              <div className="bg-red-500 text-white px-2 py-1 text-xs rounded">
                Out of Stock
              </div>
            )}
            {product.featured && (
              <div className="bg-blue-500 text-white px-2 py-1 text-xs rounded">
                Featured
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className={cn("p-6", isListView ? "flex-1" : "")}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {isListView ? product.title : truncateText(product.title, 30)}
          </h3>
          {product.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex-shrink-0">
              {product.category}
            </span>
          )}
        </div>

        {isListView && (
          <p className="text-sm text-gray-600 mb-3">
            {truncateText(product.description, 100)}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
          <div className="flex space-x-1">
            {product.sizes.slice(0, 3).map((size) => (
              <span
                key={size}
                className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-xs text-gray-400">
                +{product.sizes.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={cn(
          "flex gap-2",
          isListView ? "flex-row" : "flex-col"
        )}>
          {onAddToCart && (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart(product)
              }}
              disabled={!product.inStock}
              className="flex-1 bg-transparent border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          )}
          
          {onQuickView && (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onQuickView(product)
              }}
              className={cn(
                "transition-all duration-300",
                isListView ? "flex-shrink-0" : "flex-1"
              )}
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
