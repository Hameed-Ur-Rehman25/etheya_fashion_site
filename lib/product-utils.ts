import { Product, SearchFilters } from '@/types'

export function formatPrice(price: string | number): string {
  if (typeof price === 'string') {
    // Extract numeric value from string like "Rs. 7,560"
    const numeric = parseInt(price.replace(/[^\d]/g, ''))
    return `Rs. ${numeric.toLocaleString()}`
  }
  return `Rs. ${price.toLocaleString()}`
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
    
    // Availability filter - using inStock property for now
    if (filters.availability.length > 0) {
      const isInStock = product.inStock !== false
      if (filters.availability.includes('in-stock') && !isInStock) {
        return false
      }
      if (filters.availability.includes('out-of-stock') && isInStock) {
        return false
      }
    }
    
    // Type filter - would need to be added to product data
    if (filters.types.length > 0) {
      // For now, we'll skip this filter since type data isn't available
      // TODO: Add type field to product data
    }
    
    // Fabric filter - would need to be added to product data
    if (filters.fabrics.length > 0) {
      // For now, we'll skip this filter since fabric data isn't available
      // TODO: Add fabric field to product data
    }
    
    // Pieces filter - would need to be added to product data
    if (filters.pieces.length > 0) {
      // For now, we'll skip this filter since pieces data isn't available
      // TODO: Add pieces field to product data
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

export function extractNumericPrice(price: string): number {
  return parseInt(price.replace(/[^\d]/g, '')) || 0
}

export function generateProductSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
