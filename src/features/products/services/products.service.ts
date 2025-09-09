import { Product, SearchFilters, ProductFilters } from '../types/product.types'

export class ProductsService {
  // Mock API base URL - replace with actual API endpoint
  private static readonly API_BASE = '/api/products'

  /**
   * Fetch all products
   */
  static async getProducts(): Promise<Product[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // For now, return mock data
      // In real implementation, this would be:
      // const response = await fetch(`${this.API_BASE}`)
      // return response.json()
      
      return this.getMockProducts()
    } catch (error) {
      console.error('Failed to fetch products:', error)
      throw new Error('Failed to load products')
    }
  }

  /**
   * Fetch a single product by ID
   */
  static async getProduct(id: number): Promise<Product | null> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const products = await this.getProducts()
      return products.find(p => p.id === id) || null
    } catch (error) {
      console.error('Failed to fetch product:', error)
      throw new Error('Failed to load product')
    }
  }

  /**
   * Search products with filters
   */
  static async searchProducts(
    query?: string, 
    filters?: Partial<SearchFilters>
  ): Promise<{ products: Product[]; total: number }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400))
      
      let products = await this.getProducts()
      
      // Apply search query
      if (query && query.trim()) {
        const searchTerm = query.toLowerCase()
        products = products.filter(product =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category?.toLowerCase().includes(searchTerm)
        )
      }
      
      // Apply filters
      if (filters) {
        if (filters.categories && filters.categories.length > 0) {
          products = products.filter(p => 
            p.category && filters.categories!.includes(p.category)
          )
        }
        
        if (filters.sizes && filters.sizes.length > 0) {
          products = products.filter(p =>
            p.sizes.some(size => filters.sizes!.includes(size))
          )
        }
        
        if (filters.priceRange) {
          const [min, max] = filters.priceRange
          products = products.filter(p => {
            const price = this.extractNumericPrice(p.price)
            return price >= min && price <= max
          })
        }
      }
      
      return {
        products,
        total: products.length
      }
    } catch (error) {
      console.error('Failed to search products:', error)
      throw new Error('Failed to search products')
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const products = await this.getProducts()
      return products.filter(p => p.category === category)
    } catch (error) {
      console.error('Failed to fetch products by category:', error)
      throw new Error('Failed to load category products')
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(): Promise<Product[]> {
    try {
      const products = await this.getProducts()
      return products.filter(p => p.featured)
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
      throw new Error('Failed to load featured products')
    }
  }

  /**
   * Get related products (by category, excluding current product)
   */
  static async getRelatedProducts(productId: number, limit = 4): Promise<Product[]> {
    try {
      const product = await this.getProduct(productId)
      if (!product || !product.category) return []
      
      const products = await this.getProductsByCategory(product.category)
      return products
        .filter(p => p.id !== productId)
        .slice(0, limit)
    } catch (error) {
      console.error('Failed to fetch related products:', error)
      throw new Error('Failed to load related products')
    }
  }

  /**
   * Add product to favorites/wishlist
   */
  static async toggleWishlist(productId: number): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // In real implementation, this would update the user's wishlist
      // For now, just return success
      return true
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
      throw new Error('Failed to update wishlist')
    }
  }

  /**
   * Add product to cart
   */
  static async addToCart(productId: number, size?: string, quantity = 1): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // In real implementation, this would add to user's cart
      console.log('Adding to cart:', { productId, size, quantity })
      return true
    } catch (error) {
      console.error('Failed to add to cart:', error)
      throw new Error('Failed to add item to cart')
    }
  }

  // Helper methods
  private static extractNumericPrice(price: string): number {
    return parseInt(price.replace(/[^\d]/g, '')) || 0
  }

  private static getMockProducts(): Product[] {
    // Return mock products data
    // In real implementation, this would come from an API
    return [
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
        description: 'Comfortable cotton ensemble for everyday wear.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/assets/image3.jpeg', '/assets/image1.png'],
        category: 'Casual',
        inStock: true,
        featured: false
      },
      {
        id: 4,
        title: 'Executive Formal Blazer',
        price: 'Rs. 15,000',
        image: '/assets/image2.png',
        description: 'Professional formal blazer for corporate events and meetings.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['/assets/image2.png', '/assets/image3.jpeg'],
        category: 'Formal',
        inStock: true,
        featured: true
      }
    ]
  }
}
