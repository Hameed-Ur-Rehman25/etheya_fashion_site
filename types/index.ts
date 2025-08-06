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

export interface Category {
  id: number
  title: string
  image: string
  description: string
  slug?: string
}

export interface CartItem extends Product {
  quantity: number
  selectedSize?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface SearchFilters {
  categories: string[]
  sizes: string[]
  priceRange: [number, number]
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular'
}

export type ViewMode = 'grid' | 'list'

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}
