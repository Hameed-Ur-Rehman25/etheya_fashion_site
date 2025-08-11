// App Configuration
export const APP_CONFIG = {
  name: 'Etheya',
  description: 'Elegant women\'s clothing collection stitched & unstitched suits',
  url: 'https://etheya.com',
  supportEmail: 'support@etheya.com',
  version: '1.0.0'
} as const

// Business Configuration
export const BUSINESS_CONFIG = {
  currency: 'PKR',
  currencySymbol: 'Rs.',
  freeShippingThreshold: 5000,
  taxRate: 0.05, // 5%
  shippingCost: 250
} as const

// Available sizes across all products
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

// Available colors for filtering
export const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Gray', value: '#6B7280' }
] as const

// Sort options for products
export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Most Popular', value: 'popular' }
] as const

// Price ranges for filtering
export const PRICE_RANGES = {
  MIN: 0,
  MAX: 50000,
  STEP: 500,
  DEFAULT: [0, 50000] as [number, number]
} as const

// Navigation menu items
export const NAVIGATION_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
] as const

// Footer links
export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' }
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' }
  ]
} as const

// Social media links
export const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://facebook.com/etheya', icon: 'facebook' },
  { name: 'Instagram', href: 'https://instagram.com/etheya', icon: 'instagram' },
  { name: 'Twitter', href: 'https://twitter.com/etheya', icon: 'twitter' },
  { name: 'Pinterest', href: 'https://pinterest.com/etheya', icon: 'pinterest' }
] as const

// Newsletter configuration
export const NEWSLETTER_CONFIG = {
  title: 'Stay Updated',
  description: 'Subscribe to our newsletter for the latest updates and exclusive offers.',
  successMessage: 'Thank you for subscribing!',
  errorMessage: 'Something went wrong. Please try again.'
} as const

// Shipping information
export const SHIPPING_INFO = [
  'Free shipping on orders over Rs. 5,000',
  'Delivery within 3-5 business days',
  'Easy returns within 30 days',
  'Cash on delivery available'
] as const

// Product features
export const PRODUCT_FEATURES = [
  'High-quality fabric and construction',
  'Perfect for various occasions',
  'Available in multiple sizes',
  'Easy care and maintenance'
] as const
