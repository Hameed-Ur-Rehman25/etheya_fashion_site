import { Product } from '@/features/products/types/product.types'

export interface WishlistItem {
  id: number
  product: Product
  addedAt: Date
}

export interface Wishlist {
  items: WishlistItem[]
  totalItems: number
  lastUpdated: Date
}

export interface WishlistActions {
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  clearWishlist: () => void
  toggleItem: (product: Product) => void
}

export interface WishlistState {
  wishlist: Wishlist
  loading: boolean
  error: string | null
}

export interface WishlistDisplayProps {
  items: WishlistItem[]
  onRemoveItem: (productId: number) => void
  onAddToCart: (product: Product) => void
  loading?: boolean
}
