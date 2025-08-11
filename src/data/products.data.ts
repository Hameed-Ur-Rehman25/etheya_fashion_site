import { Product } from '@/features/products/types/product.types'
import { Category } from '@/features/categories/types/category.types'

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Unstitched Summer Embroidered Lawn Use-9250',
    price: 'Rs. 6,250',
    image: '/assets/image1.png',
    description: 'Beautiful embroidered lawn suit perfect for summer occasions. Features intricate embroidery work with traditional motifs.',
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
    description: 'Elegant silk formal dress with intricate detailing. Perfect for formal occasions and special events.',
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
    description: 'Comfortable cotton casual wear for everyday use. Breathable fabric with modern cuts.',
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
    description: 'Stunning designer party wear with premium fabric. Luxurious design for special occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image.png', '/assets/image2.png'],
    category: 'Luxury Lawn',
    inStock: true,
    featured: true
  },
  {
    id: 5,
    title: 'Chiffon Evening Collection',
    price: 'Rs. 9,750',
    image: '/assets/image3.jpeg',
    description: 'Flowing chiffon evening wear with delicate embellishments. Perfect for evening events.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image3.jpeg', '/assets/image1.png'],
    category: 'Evening Wear',
    inStock: true,
    featured: false
  },
  {
    id: 6,
    title: 'Traditional Bridal Suite',
    price: 'Rs. 25,000',
    image: '/assets/image1.png',
    description: 'Exquisite traditional bridal suite with heavy embroidery and premium finishing.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image1.png', '/assets/image2.png'],
    category: 'Bridal',
    inStock: true,
    featured: true
  },
  {
    id: 7,
    title: 'Summer Lawn Collection',
    price: 'Rs. 3,500',
    image: '/assets/image2.png',
    description: 'Light and airy summer lawn with vibrant prints. Perfect for hot weather.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image2.png', '/assets/image3.jpeg'],
    category: 'Summer Collection',
    inStock: true,
    featured: false
  },
  {
    id: 8,
    title: 'Winter Velvet Collection',
    price: 'Rs. 14,500',
    image: '/assets/image.png',
    description: 'Rich velvet collection for winter season. Warm and elegant design.',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/assets/image.png', '/assets/image1.png'],
    category: 'Winter Collection',
    inStock: false,
    featured: false
  }
]

export const CATEGORIES: Category[] = [
  {
    id: 1,
    title: 'Unstitched',
    image: '/assets/image1.png',
    description: 'Premium unstitched fabrics for custom tailoring',
    slug: 'unstitched',
    productCount: 15,
    featured: true
  },
  {
    id: 2,
    title: 'Ready to Wear',
    image: '/assets/image2.png',
    description: 'Ready-made garments for immediate wear',
    slug: 'ready-to-wear',
    productCount: 28,
    featured: true
  },
  {
    id: 3,
    title: 'Formal',
    image: '/assets/image3.jpeg',
    description: 'Elegant formal wear for special occasions',
    slug: 'formal',
    productCount: 12,
    featured: true
  },
  {
    id: 4,
    title: 'Luxury Lawn',
    image: '/assets/image.png',
    description: 'Premium lawn collection with exclusive designs',
    slug: 'luxury-lawn',
    productCount: 20,
    featured: true
  },
  {
    id: 5,
    title: 'Bridal',
    image: '/assets/image1.png',
    description: 'Exquisite bridal collection for your special day',
    slug: 'bridal',
    productCount: 8,
    featured: true
  },
  {
    id: 6,
    title: 'Evening Wear',
    image: '/assets/image2.png',
    description: 'Sophisticated evening wear for night events',
    slug: 'evening-wear',
    productCount: 10,
    featured: false
  },
  {
    id: 7,
    title: 'Summer Collection',
    image: '/assets/image3.jpeg',
    description: 'Light and comfortable summer collection',
    slug: 'summer-collection',
    productCount: 25,
    featured: false
  },
  {
    id: 8,
    title: 'Winter Collection',
    image: '/assets/image.png',
    description: 'Warm and cozy winter collection',
    slug: 'winter-collection',
    productCount: 18,
    featured: false
  }
]
