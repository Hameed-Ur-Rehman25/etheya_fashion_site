// Products Module Barrel Exports

// Components
export { ProductCard } from './components/product-card'
export { ProductGrid } from './components/product-grid'
export { ProductModal } from './components/product-modal'

// Hooks
export { useProducts } from './hooks/use-products'
export { useProductFilters } from './hooks/use-product-filters'
export { useProductSearch } from './hooks/use-product-search'

// Services
export { ProductsService } from './services/products.service'

// Types
export type {
  Product,
  CartItem,
  SearchFilters,
  ViewMode,
  ProductFilters,
  ProductSearchResult,
  ProductActions,
  ProductDisplayProps,
  ProductSortOption
} from './types/product.types'

// Utils
export {
  formatPrice,
  extractNumericPrice,
  filterProducts,
  sortProducts,
  searchProducts,
  truncateText,
  generateProductSlug,
  isProductInStock,
  getProductDisplayPrice,
  getAvailableSizes,
  getAvailableCategories,
  getPriceRange
} from './utils/product.utils'
