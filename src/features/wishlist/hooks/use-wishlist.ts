import { useState, useCallback, useEffect } from 'react'
import { WishlistItem, Wishlist } from '../types/wishlist.types'
import { Product } from '../../products/types/product.types'

const WISHLIST_STORAGE_KEY = 'etheya-wishlist'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Wishlist>({
    items: [],
    totalItems: 0,
    lastUpdated: new Date()
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        // Convert date strings back to Date objects
        parsedWishlist.lastUpdated = new Date(parsedWishlist.lastUpdated)
        parsedWishlist.items = parsedWishlist.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }))
        setWishlist(parsedWishlist)
      } catch (error) {
        console.error('Failed to load wishlist from storage:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  const addItem = useCallback((product: Product) => {
    setLoading(true)
    setError(null)

    try {
      setWishlist(prevWishlist => {
        // Check if item already exists in wishlist
        const existingItem = prevWishlist.items.find(
          item => item.product.id === product.id
        )

        if (existingItem) {
          // Item already in wishlist, don't add again
          return prevWishlist
        }

        // Add new item
        const newItem: WishlistItem = {
          id: Date.now() + Math.random(), // Simple ID generation
          product,
          addedAt: new Date()
        }

        const newItems = [...prevWishlist.items, newItem]

        return {
          items: newItems,
          totalItems: newItems.length,
          lastUpdated: new Date()
        }
      })
    } catch (error) {
      setError('Failed to add item to wishlist')
      console.error('Add to wishlist error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const removeItem = useCallback((productId: number) => {
    setLoading(true)
    setError(null)

    try {
      setWishlist(prevWishlist => {
        const newItems = prevWishlist.items.filter(
          item => item.product.id !== productId
        )

        return {
          items: newItems,
          totalItems: newItems.length,
          lastUpdated: new Date()
        }
      })
    } catch (error) {
      setError('Failed to remove item from wishlist')
      console.error('Remove from wishlist error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleItem = useCallback((product: Product) => {
    const isInWishlist = wishlist.items.some(item => item.product.id === product.id)
    
    if (isInWishlist) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }, [wishlist.items, addItem, removeItem])

  const clearWishlist = useCallback(() => {
    setLoading(true)
    setError(null)

    try {
      setWishlist({
        items: [],
        totalItems: 0,
        lastUpdated: new Date()
      })
    } catch (error) {
      setError('Failed to clear wishlist')
      console.error('Clear wishlist error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const isInWishlist = useCallback((productId: number) => {
    return wishlist.items.some(item => item.product.id === productId)
  }, [wishlist.items])

  const getWishlistedIds = useCallback(() => {
    return new Set(wishlist.items.map(item => item.product.id))
  }, [wishlist.items])

  return {
    // State
    wishlist,
    loading,
    error,
    
    // Actions
    addItem,
    removeItem,
    toggleItem,
    clearWishlist,
    
    // Computed
    isEmpty: wishlist.items.length === 0,
    itemCount: wishlist.totalItems,
    isInWishlist,
    getWishlistedIds
  }
}
