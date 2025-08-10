export interface Product {
  id: number
  title: string
  price: string
  image: string
  description: string
  sizes: string[]
  images: string[]
  category?: string
  inStock?: boolean
  featured?: boolean
}

export interface CartItem extends Product {
  quantity: number
  selectedSize?: string
}

export interface SearchFilters {
  categories: string[]
  sizes: string[]
  priceRange: [number, number]
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular'
}

export type ViewMode = 'grid' | 'list'

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  sizes?: string[]
}

export interface ProductSearchResult {
  products: Product[]
  totalCount: number
  filters: SearchFilters
}

// Product actions
export interface ProductActions {
  onQuickView?: (product: Product) => void
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
}

// Product display props
export interface ProductDisplayProps {
  product: Product
  viewMode?: ViewMode
  isWishlisted?: boolean
  className?: string
}

export type ProductSortOption = SearchFilters['sortBy']
