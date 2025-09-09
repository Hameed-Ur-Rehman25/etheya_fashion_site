import { Product, Category } from '@/types'

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Festive Embroidered Lawn Suit',
    price: 'Rs. 6,250',
    image: '/assets/image1.png',
    description: 'Beautiful embroidered lawn suit perfect for festive occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image1.png', '/assets/image2.png'],
    category: 'Festive',
    inStock: true,
    featured: true
  },
  {
    id: 2,
    title: 'Semi-Formal Silk Dress Collection',
    price: 'Rs. 12,500',
    image: '/assets/image2.png',
    description: 'Elegant semi-formal silk dress with intricate detailing.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image2.png', '/assets/image3.jpeg'],
    category: 'Semi-Formal',
    inStock: true,
    featured: true
  },
  {
    id: 3,
    title: 'Casual Cotton Wear Ensemble',
    price: 'Rs. 4,200',
    image: '/assets/image3.jpeg',
    description: 'Comfortable cotton casual wear for everyday use.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image3.jpeg', '/assets/image1.png'],
    category: 'Casual',
    inStock: true,
    featured: false
  },
  {
    id: 4,
    title: 'Festive Designer Party Wear',
    price: 'Rs. 18,000',
    image: '/assets/image.png',
    description: 'Stunning festive party wear with premium fabric.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image.png', '/assets/image2.png'],
    category: 'Festive',
    inStock: true,
    featured: true
  },
  {
    id: 5,
    title: 'Semi-Formal Chiffon Elegance',
    price: 'Rs. 15,000',
    image: '/assets/image2.png',
    description: 'Stunning semi-formal chiffon wear with beadwork.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image2.png', '/assets/image1.png'],
    category: 'Semi-Formal',
    inStock: true,
    featured: false
  },
  {
    id: 6,
    title: 'Festive Traditional Embroidered Set',
    price: 'Rs. 8,900',
    image: '/assets/image1.png',
    description: 'Traditional festive embroidered outfit with modern touch.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image1.png', '/assets/image3.jpeg'],
    category: 'Festive',
    inStock: true,
    featured: false
  },
  {
    id: 7,
    title: 'Contemporary Casual Line',
    price: 'Rs. 5,750',
    image: '/assets/image3.jpeg',
    description: 'Modern casual wear with contemporary design.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image3.jpeg', '/assets/image.png'],
    category: 'Casual',
    inStock: false,
    featured: false
  },
  {
    id: 8,
    title: 'Semi-Formal Luxury Collection',
    price: 'Rs. 22,000',
    image: '/assets/image.png',
    description: 'Premium luxury semi-formal wear for special occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image.png', '/assets/image1.png'],
    category: 'Semi-Formal',
    inStock: true,
    featured: true
  },
  {
    id: 9,
    title: 'Executive Formal Blazer',
    price: 'Rs. 15,000',
    image: '/assets/image2.png',
    description: 'Professional formal blazer for corporate events and meetings.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image2.png', '/assets/image3.jpeg'],
    category: 'Formal',
    inStock: true,
    featured: true
  },
  {
    id: 10,
    title: 'Classic Formal Suit',
    price: 'Rs. 18,500',
    image: '/assets/image3.jpeg',
    description: 'Elegant formal suit perfect for business meetings and professional occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image3.jpeg', '/assets/image1.png'],
    category: 'Formal',
    inStock: true,
    featured: false
  }
]

export const CATEGORIES: Category[] = [
  {
    id: 1,
    title: 'Festive',
    image: '/assets/image.png',
    description: 'Elegant festive wear for special celebrations',
    slug: 'festive'
  },
  {
    id: 2,
    title: 'Casual',
    image: '/assets/image.png',
    description: 'Comfortable and stylish everyday wear',
    slug: 'casual'
  },
  {
    id: 3,
    title: 'Semi-Formal',
    image: '/assets/image.png',
    description: 'Perfect for business casual and smart occasions',
    slug: 'semi-formal'
  },
  {
    id: 4,
    title: 'Formal',
    image: '/assets/image.png',
    description: 'Sophisticated formal wear for professional events',
    slug: 'formal'
  }
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
export const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Yellow']

export const SUB_CATEGORIES = ['GenZ', 'Jhalak', 'Sada']

export const AVAILABILITY_OPTIONS = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
  { value: 'pre-order', label: 'Pre-Order' }
]

export const TYPE_OPTIONS = [
  { value: 'shirt', label: 'Shirt' },
  { value: 'trouser', label: 'Trouser' },
  { value: 'suit', label: 'Suit' },
  { value: 'dress', label: 'Dress' },
  { value: 'kurta', label: 'Kurta' },
  { value: 'dupatta', label: 'Dupatta' }
]

export const FABRIC_OPTIONS = [
  { value: 'cotton', label: 'Cotton' },
  { value: 'silk', label: 'Silk' },
  { value: 'chiffon', label: 'Chiffon' },
  { value: 'lawn', label: 'Lawn' },
  { value: 'linen', label: 'Linen' },
  { value: 'georgette', label: 'Georgette' },
  { value: 'organza', label: 'Organza' }
]

export const PIECES_OPTIONS = [
  { value: '1-piece', label: '1 Piece' },
  { value: '2-piece', label: '2 Piece' },
  { value: '3-piece', label: '3 Piece' },
  { value: '4-piece', label: '4 Piece' }
]

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
