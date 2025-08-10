import { Product } from '@/features/products/types/product.types'

export interface CartItem {
  id: number
  product: Product
  quantity: number
  selectedSize?: string
  addedAt: Date
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  lastUpdated: Date
}

export interface CartState {
  cart: Cart
  isOpen: boolean
  loading: boolean
  error: string | null
}

export interface CartActions {
  addItem: (product: Product, size?: string, quantity?: number) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
}

export interface CartContextType extends CartState, CartActions {}

// Cart summary for checkout
export interface CartSummary {
  subtotal: number
  shipping: number
  tax: number
  total: number
  itemCount: number
}
