import { Product, SearchFilters, ProductFilters } from '../types/product.types'

export function formatPrice(price: string | number): string {
  if (typeof price === 'string') {
    // Extract numeric value from string like "Rs. 7,560"
    const numeric = parseInt(price.replace(/[^\d]/g, ''))
    return `Rs. ${numeric.toLocaleString()}`
  }
  return `Rs. ${price.toLocaleString()}`
}

export function extractNumericPrice(price: string): number {
  return parseInt(price.replace(/[^\d]/g, '')) || 0
}

export function filterProducts(products: Product[], filters: SearchFilters): Product[] {
  return products.filter((product) => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category || '')) {
      return false
    }
    
    // Size filter
    if (filters.sizes.length > 0 && !product.sizes.some(size => filters.sizes.includes(size))) {
      return false
    }
    
    // Price filter
    const numericPrice = extractNumericPrice(product.price)
    if (numericPrice < filters.priceRange[0] || numericPrice > filters.priceRange[1]) {
      return false
    }
    
    return true
  })
}

export function sortProducts(products: Product[], sortBy: SearchFilters['sortBy']): Product[] {
  const sorted = [...products]
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => extractNumericPrice(a.price) - extractNumericPrice(b.price))
    case 'price-high':
      return sorted.sort((a, b) => extractNumericPrice(b.price) - extractNumericPrice(a.price))
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id)
    case 'popular':
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    default:
      return sorted
  }
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products
  
  const searchTerm = query.toLowerCase().trim()
  
  return products.filter(product => 
    product.title.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category?.toLowerCase().includes(searchTerm)
  )
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function generateProductSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function isProductInStock(product: Product): boolean {
  return product.inStock !== false
}

export function getProductDisplayPrice(product: Product): { current: string; original?: string } {
  // For now, just return the formatted price
  // In the future, this could handle discounts, sales, etc.
  return {
    current: formatPrice(product.price)
  }
}

export function getAvailableSizes(products: Product[]): string[] {
  const allSizes = products.flatMap(product => product.sizes)
  return [...new Set(allSizes)].sort()
}

export function getAvailableCategories(products: Product[]): string[] {
  const categories = products
    .map(product => product.category)
    .filter((category): category is string => Boolean(category))
  return [...new Set(categories)].sort()
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 }
  
  const prices = products.map(product => extractNumericPrice(product.price))
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
}
