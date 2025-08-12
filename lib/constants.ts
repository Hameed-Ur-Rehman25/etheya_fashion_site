import { Product, Category } from '@/types'

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Unstitched Summer Embroidered Lawn Use-9250',
    price: 'Rs. 6,250',
    image: '/assets/image1.png',
    description: 'Beautiful embroidered lawn suit perfect for summer occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image1.png', '/assets/image2.png'],
    category: 'Unstitched',
    inStock: true,
    featured: true
  },
  {
    id: 2,
    title: 'Silk Formal Dress Collection',
    price: 'Rs. 12,500',
    image: '/assets/image2.png',
    description: 'Elegant silk formal dress with intricate detailing.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image2.png', '/assets/image3.jpeg'],
    category: 'Formal',
    inStock: true,
    featured: true
  },
  {
    id: 3,
    title: 'Cotton Casual Wear Ensemble',
    price: 'Rs. 4,200',
    image: '/assets/image3.jpeg',
    description: 'Comfortable cotton casual wear for everyday use.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image3.jpeg', '/assets/image1.png'],
    category: 'Ready to Wear',
    inStock: true,
    featured: false
  },
  {
    id: 4,
    title: 'Designer Party Wear Premium',
    price: 'Rs. 18,000',
    image: '/assets/image.png',
    description: 'Stunning designer party wear with premium fabric.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image.png', '/assets/image2.png'],
    category: 'Luxury Lawn',
    inStock: true,
    featured: true
  },
  {
    id: 5,
    title: 'Chiffon Party Wear Elegance',
    price: 'Rs. 15,000',
    image: '/assets/image2.png',
    description: 'Stunning chiffon party wear with beadwork.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image2.png', '/assets/image1.png'],
    category: 'Formal',
    inStock: true,
    featured: false
  },
  {
    id: 6,
    title: 'Traditional Embroidered Set',
    price: 'Rs. 8,900',
    image: '/assets/image1.png',
    description: 'Traditional embroidered outfit with modern touch.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image1.png', '/assets/image3.jpeg'],
    category: 'Unstitched',
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
    category: 'Ready to Wear',
    inStock: false,
    featured: false
  },
  {
    id: 8,
    title: 'Luxury Formal Collection',
    price: 'Rs. 22,000',
    image: '/assets/image.png',
    description: 'Premium luxury formal wear for special occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image.png', '/assets/image1.png'],
    category: 'Luxury Lawn',
    inStock: true,
    featured: true
  }
]

export const CATEGORIES: Category[] = [
  {
    id: 1,
    title: 'UNSTITCHED',
    image: '/assets/image.png',
    description: 'Premium fabric collections',
    slug: 'unstitched'
  },
  {
    id: 2,
    title: 'FORMAL',
    image: '/assets/image.png',
    description: 'Elegant formal wear',
    slug: 'formal'
  },
  {
    id: 3,
    title: 'READY TO WEAR',
    image: '/assets/image.png',
    description: 'Contemporary designs',
    slug: 'ready-to-wear'
  },
  {
    id: 4,
    title: 'LUXURY LAWN',
    image: '/assets/image.png',
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
