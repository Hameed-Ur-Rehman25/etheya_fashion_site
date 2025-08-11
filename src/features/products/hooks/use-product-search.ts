import { useState, useCallback, useEffect } from 'react'
import { Product } from '../types/product.types'
import { searchProducts } from '../utils/product.utils'

interface UseProductSearchOptions {
  products: Product[]
  debounceMs?: number
  minSearchLength?: number
}

export function useProductSearch(options: UseProductSearchOptions) {
  const { products, debounceMs = 300, minSearchLength = 2 } = options
  
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs])

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= minSearchLength) {
      setIsSearching(true)
      
      // Simulate search delay
      const timer = setTimeout(() => {
        const searchResults = searchProducts(products, debouncedQuery)
        setResults(searchResults)
        setIsSearching(false)
        
        // Generate suggestions based on search results
        const suggestionSet = new Set<string>()
        searchResults.forEach(product => {
          if (product.category) suggestionSet.add(product.category)
          product.title.split(' ').forEach(word => {
            if (word.length > 3) suggestionSet.add(word)
          })
        })
        setSuggestions(Array.from(suggestionSet).slice(0, 5))
      }, 100)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setSuggestions([])
      setIsSearching(false)
    }
  }, [debouncedQuery, products, minSearchLength])

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery)
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
    setResults([])
    setSuggestions([])
    setIsSearching(false)
  }, [])

  const selectSuggestion = useCallback((suggestion: string) => {
    setQuery(suggestion)
  }, [])

  return {
    // State
    query,
    debouncedQuery,
    results,
    isSearching,
    suggestions,
    
    // Actions
    updateQuery,
    clearSearch,
    selectSuggestion,
    
    // Computed
    hasQuery: query.length > 0,
    hasResults: results.length > 0,
    isActive: debouncedQuery.length >= minSearchLength
  }
}
