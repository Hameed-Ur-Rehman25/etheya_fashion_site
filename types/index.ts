export interface Product {
  id: number
  title: string
  price: string
  image: string
  description: string
  sizes: string[]
  images: string[]
  category?: string
  subCategory?: string
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

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  price: number; // always a number for calculations
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface SearchFilters {
  categories: string[]
  subCategories: string[]
  sizes: string[]
  availability: string[]
  types: string[]
  fabrics: string[]
  pieces: string[]
  priceRange: [number, number]
  sortBy: 'newest' | 'price-low' | 'price-high' | 'popular'
}

export type ViewMode = 'grid' | 'list'

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

// Customer types based on backend schema
export interface Customer {
  id: string
  email?: string
  phone: string
  first_name: string
  last_name: string
  address: string
  apartment?: string
  city: string
  postal_code?: string
  country: string
  created_at: string
}

export interface CreateCustomerData {
  email?: string
  phone: string
  first_name: string
  last_name: string
  address: string
  apartment?: string
  city: string
  postal_code?: string
  country: string
}

// Order types based on backend schema
export interface Order {
  id: string
  customer_id: string
  subtotal: number
  shipping_cost: number
  total: number
  shipping_method: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered'
  payment_proof_url?: string
  created_at: string
}

export interface CreateOrderData {
  customer_id: string
  subtotal: number
  shipping_cost: number
  total: number
  shipping_method?: string
  status?: 'pending' | 'paid' | 'shipped' | 'delivered'
  payment_proof_url?: string
}

// Order item types based on backend schema
export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  size: 'S' | 'M' | 'L' | 'XL'
  quantity: number
  price: number
}

export interface CreateOrderItemData {
  order_id: string
  product_id: string
  size: 'S' | 'M' | 'L' | 'XL'
  quantity: number
  price: number
}
