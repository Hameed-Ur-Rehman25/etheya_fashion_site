import { useState, useCallback, useEffect } from 'react'
import { CartItem, Cart, CartSummary } from '../types/cart.types'
import { Product } from '@/features/products/types/product.types'
import { extractNumericPrice } from '@/features/products/utils/product.utils'

const CART_STORAGE_KEY = 'etheya-cart'

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    lastUpdated: new Date()
  })
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Convert date strings back to Date objects
        parsedCart.lastUpdated = new Date(parsedCart.lastUpdated)
        parsedCart.items = parsedCart.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }))
        setCart(parsedCart)
      } catch (error) {
        console.error('Failed to load cart from storage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  // Calculate cart totals
  const calculateTotals = useCallback((items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => {
      const price = extractNumericPrice(item.product.price)
      return sum + (price * item.quantity)
    }, 0)
    
    return { totalItems, totalPrice }
  }, [])

  const addItem = useCallback((product: Product, size?: string, quantity = 1) => {
    setLoading(true)
    setError(null)

    try {
      setCart(prevCart => {
        // Check if item already exists in cart
        const existingItemIndex = prevCart.items.findIndex(
          item => item.product.id === product.id && item.selectedSize === size
        )

        let newItems: CartItem[]
        
        if (existingItemIndex > -1) {
          // Update existing item quantity
          newItems = [...prevCart.items]
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity
          }
        } else {
          // Add new item
          const newItem: CartItem = {
            id: Date.now() + Math.random(), // Simple ID generation
            product,
            quantity,
            selectedSize: size,
            addedAt: new Date()
          }
          newItems = [...prevCart.items, newItem]
        }

        const { totalItems, totalPrice } = calculateTotals(newItems)

        return {
          items: newItems,
          totalItems,
          totalPrice,
          lastUpdated: new Date()
        }
      })
    } catch (error) {
      setError('Failed to add item to cart')
      console.error('Add to cart error:', error)
    } finally {
      setLoading(false)
    }
  }, [calculateTotals])

  const removeItem = useCallback((itemId: number) => {
    setLoading(true)
    setError(null)

    try {
      setCart(prevCart => {
        const newItems = prevCart.items.filter(item => item.id !== itemId)
        const { totalItems, totalPrice } = calculateTotals(newItems)

        return {
          items: newItems,
          totalItems,
          totalPrice,
          lastUpdated: new Date()
        }
      })
    } catch (error) {
      setError('Failed to remove item from cart')
      console.error('Remove from cart error:', error)
    } finally {
      setLoading(false)
    }
  }, [calculateTotals])

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setLoading(true)
    setError(null)

    try {
      setCart(prevCart => {
        const newItems = prevCart.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
        const { totalItems, totalPrice } = calculateTotals(newItems)

        return {
          items: newItems,
          totalItems,
          totalPrice,
          lastUpdated: new Date()
        }
      })
    } catch (error) {
      setError('Failed to update item quantity')
      console.error('Update quantity error:', error)
    } finally {
      setLoading(false)
    }
  }, [calculateTotals, removeItem])

  const clearCart = useCallback(() => {
    setLoading(true)
    setError(null)

    try {
      setCart({
        items: [],
        totalItems: 0,
        totalPrice: 0,
        lastUpdated: new Date()
      })
    } catch (error) {
      setError('Failed to clear cart')
      console.error('Clear cart error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const openCart = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Calculate cart summary for checkout
  const getCartSummary = useCallback((): CartSummary => {
    const subtotal = cart.totalPrice
    const shipping = subtotal > 5000 ? 0 : 250 // Free shipping over Rs. 5000
    const tax = subtotal * 0.05 // 5% tax
    const total = subtotal + shipping + tax

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount: cart.totalItems
    }
  }, [cart])

  return {
    // State
    cart,
    isOpen,
    loading,
    error,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    
    // Computed
    isEmpty: cart.items.length === 0,
    itemCount: cart.totalItems,
    getCartSummary
  }
}
