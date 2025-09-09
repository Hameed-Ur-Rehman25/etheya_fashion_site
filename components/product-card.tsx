'use client'

import Image from 'next/image'
import { Heart, ShoppingBag, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product, ViewMode } from '@/types'
import { useWishlist } from '../context/WishlistContext'
import { useBuyNow } from '../context/BuyNowContext'
import { formatPrice, truncateText } from '@/lib/product-utils'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

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
  className
}: ProductCardProps) {
  const isListView = viewMode === 'list'
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { setBuyNowItem } = useBuyNow();
  const router = useRouter();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0];
    setBuyNowItem(product, 1, defaultSize);
    router.push('/delivery-details');
  };

  return (
    <div
      className={cn(
        "group cursor-pointer transition-all duration-300 bg-white rounded-lg overflow-hidden border",
        // Mobile: tighter, smaller, no hover effects
        "p-2 gap-1",
        // Desktop: restore original padding, hover
        "sm:p-6 sm:gap-2 sm:hover:-translate-y-2 sm:hover:shadow-xl",
        isListView ? "flex" : "",
        className
      )}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden aspect-[3/4]",
        isListView ? "w-48 flex-shrink-0" : ""
      )}>
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          width={300}
          height={400}
          className="object-cover w-full h-40 sm:h-80 rounded-md"
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
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
        >
          <Heart
            className={cn(
              "w-4 h-4",
              isWishlisted(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </Button>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            Out of Stock
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
            Featured
          </div>
        )}
      </div>
      
      {/* Content Section */}
  <div className={cn("pt-2 px-1 pb-1 sm:p-6", isListView ? "flex-1" : "")}> 
        <div className="flex flex-col gap-1 mb-1">
          <h3 className="text-[13px] font-semibold text-gray-900 sm:text-lg group-hover:text-blue-600 transition-colors">
            {isListView ? product.title : truncateText(product.title, 30)}
          </h3>
          {product.category && (
            <span className="text-[11px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded w-fit">
              {product.category}
            </span>
          )}
        </div>

        {isListView && (
          <p className="text-sm text-gray-600 mb-3">
            {truncateText(product.description, 100)}
          </p>
        )}

        <div className="flex items-center justify-between mb-2">
          <p className="text-[15px] font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
          <span className="text-[11px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded">NEW IN</span>
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
          
          {/* Buy Now Button */}
          <Button
            onClick={handleBuyNow}
            disabled={!product.inStock}
            className={cn(
              "bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300",
              isListView ? "flex-shrink-0" : "flex-1"
            )}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
          
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
