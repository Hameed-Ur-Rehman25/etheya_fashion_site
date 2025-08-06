import { Product, Category } from '@/types'

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Embroidered Lawn Suit',
    price: 'Rs. 7,560',
    image: '/placeholder.svg?height=400&width=300',
    description: 'Beautiful embroidered lawn suit perfect for summer occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg?height=400&width=300', '/placeholder.svg?height=400&width=300'],
    category: 'Unstitched',
    inStock: true,
    featured: true
  },
  {
    id: 2,
    title: 'Silk Formal Dress',
    price: 'Rs. 12,500',
    image: '/placeholder.svg?height=400&width=300',
    description: 'Elegant silk formal dress with intricate detailing.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg?height=400&width=300', '/placeholder.svg?height=400&width=300'],
    category: 'Formal',
    inStock: true,
    featured: true
  },
  {
    id: 3,
    title: 'Cotton Casual Wear',
    price: 'Rs. 4,200',
    image: '/placeholder.svg?height=400&width=300',
    description: 'Comfortable cotton casual wear for everyday use.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg?height=400&width=300', '/placeholder.svg?height=400&width=300'],
    category: 'Ready to Wear',
    inStock: true,
    featured: false
  },
  {
    id: 4,
    title: 'Designer Party Wear',
    price: 'Rs. 18,000',
    image: '/placeholder.svg?height=400&width=300',
    description: 'Stunning designer party wear with premium fabric.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg?height=400&width=300', '/placeholder.svg?height=400&width=300'],
    category: 'Luxury Lawn',
    inStock: true,
    featured: true
  },
  {
    id: 5,
    title: 'Chiffon Party Wear',
    price: 'Rs. 15,000',
    image: '/placeholder.svg?height=400&width=300',
    description: 'Stunning chiffon party wear with beadwork.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg?height=400&width=300', '/placeholder.svg?height=400&width=300'],
    category: 'Formal',
    inStock: true,
    featured: false
  }
]

export const CATEGORIES: Category[] = [
  {
    id: 1,
    title: 'UNSTITCHED',
    image: '/placeholder.svg?height=500&width=300',
    description: 'Premium fabric collections',
    slug: 'unstitched'
  },
  {
    id: 2,
    title: 'FORMAL',
    image: '/placeholder.svg?height=500&width=300',
    description: 'Elegant formal wear',
    slug: 'formal'
  },
  {
    id: 3,
    title: 'READY TO WEAR',
    image: '/placeholder.svg?height=500&width=300',
    description: 'Contemporary designs',
    slug: 'ready-to-wear'
  },
  {
    id: 4,
    title: 'LUXURY LAWN',
    image: '/placeholder.svg?height=500&width=300',
    description: 'Summer essentials',
    slug: 'luxury-lawn'
  }
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Yellow']
export const PRICE_RANGES = {
  MIN: 0,
  MAX: 50000,
  STEP: 1000
}

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' }
] as const
