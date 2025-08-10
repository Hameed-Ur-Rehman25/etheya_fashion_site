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

export interface CartSummary {
  subtotal: number
  shipping: number
  tax: number
  total: number
  itemCount: number
}

export interface CartActions {
  addItem: (product: Product, size?: string, quantity?: number) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
}

export interface CartState {
  cart: Cart
  isOpen: boolean
  loading: boolean
  error: string | null
}

// Cart persistence options
export interface CartPersistenceOptions {
  storageKey?: string
  autoSave?: boolean
  saveToServer?: boolean
}

// Checkout related types
export interface CheckoutItem {
  productId: number
  productTitle: string
  price: number
  quantity: number
  size?: string
  total: number
}

export interface CheckoutSummary extends CartSummary {
  items: CheckoutItem[]
  discount?: number
  couponCode?: string
}
