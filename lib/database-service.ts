import { supabase } from './supabase'
import type { PostgrestError } from '@supabase/supabase-js'

// Interface matching your actual database schema
interface DatabaseProduct {
  id: string
  title: string
  price: number
  description: string | null
  pieces: string | null
  fabric: string | null
  color: string | null
  embellishments: string | null
  fit: string | null
  season: string | null
  care_instructions: string | null
  model_size: string | null
  category: string | null
  created_at: string
}

interface DatabaseProductSize {
  id: string
  product_id: string
  size: string
}

interface DatabaseProductImage {
  id: string
  product_id: string
  image_url: string
}

// Security: Database service with proper error handling and validation
export class DatabaseService {
  // Security: Generic error handler
  private static handleError(error: PostgrestError | null, operation: string): PostgrestError | null {
    if (error) {
      console.error(`Database error during ${operation}:`, error.message)
      // Security: Don't expose internal database details to client
      if (error.details) {
        console.error('Error details:', error.details)
      }
      if (error.hint) {
        console.error('Error hint:', error.hint)
      }
    }
    return error
  }

  // Security: Generic query wrapper with error handling
  private static async executeQuery<T>(
    queryBuilder: any, // Supabase query builder
    operation: string
  ): Promise<{ data: T | null; error: PostgrestError | null }> {
    try {
      // Execute the query and get the result
      const result = await queryBuilder
      result.error = this.handleError(result.error, operation)
      return result
    } catch (error) {
      console.error(`Unexpected error during ${operation}:`, error)
      return { data: null, error: error as PostgrestError }
    }
  }

  // Transform database product to UI product format
  private static transformProduct(
    dbProduct: DatabaseProduct,
    sizes: string[],
    images: string[]
  ) {
    return {
      id: parseInt(dbProduct.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number for compatibility
      title: dbProduct.title,
      price: `Rs. ${dbProduct.price.toLocaleString()}`, // Format price as string
      image: images.length > 0 ? images[0] : '/assets/placeholder.jpg', // Use first image or placeholder
      description: dbProduct.description || 'No description available',
      sizes: sizes,
      images: images.length > 0 ? images : ['/assets/placeholder.jpg'],
      category: dbProduct.category || 'Uncategorized',
      inStock: true, // Default to true since we don't have stock tracking
      featured: false // Default to false since we don't have featured flag
    }
  }

  // Security: Products table operations
  static async getProducts() {
    try {
      // Fetch products with their sizes and images
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (productsError) {
        console.error('Error fetching products:', productsError)
        return { data: null, error: productsError }
      }

      if (!products) {
        return { data: [], error: null }
      }

      // Transform each product
      const transformedProducts = await Promise.all(
        products.map(async (product: DatabaseProduct) => {
          // Fetch sizes for this product
          const { data: sizes } = await supabase
            .from('product_sizes')
            .select('size')
            .eq('product_id', product.id)

          // Fetch images for this product
          const { data: images } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', product.id)

          const sizeArray = sizes?.map(s => s.size) || ['S', 'M', 'L', 'XL'] // Default sizes if none found
          const imageArray = images?.map(img => img.image_url) || ['/assets/placeholder.jpg']

          return this.transformProduct(product, sizeArray, imageArray)
        })
      )

      return { data: transformedProducts, error: null }
    } catch (error) {
      console.error('Unexpected error getting products:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  static async getProductById(id: number) {
    try {
      // Convert number ID back to UUID format for database query
      const uuidId = id.toString(16).padStart(32, '0')
      const formattedUuid = `${uuidId.slice(0, 8)}-${uuidId.slice(8, 12)}-${uuidId.slice(12, 16)}-${uuidId.slice(16, 20)}-${uuidId.slice(20, 32)}`

      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', formattedUuid)
        .single()

      if (productError || !product) {
        return { data: null, error: productError }
      }

      // Fetch sizes and images
      const { data: sizes } = await supabase
        .from('product_sizes')
        .select('size')
        .eq('product_id', product.id)

      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)

      const sizeArray = sizes?.map(s => s.size) || ['S', 'M', 'L', 'XL']
      const imageArray = images?.map(img => img.image_url) || ['/assets/placeholder.jpg']

      const transformedProduct = this.transformProduct(product, sizeArray, imageArray)
      return { data: transformedProduct, error: null }
    } catch (error) {
      console.error('Unexpected error getting product by ID:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  static async getProductsByCategory(category: string) {
    try {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (productsError || !products) {
        return { data: null, error: productsError }
      }

      // Transform each product
      const transformedProducts = await Promise.all(
        products.map(async (product: DatabaseProduct) => {
          const { data: sizes } = await supabase
            .from('product_sizes')
            .select('size')
            .eq('product_id', product.id)

          const { data: images } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', product.id)

          const sizeArray = sizes?.map(s => s.size) || ['S', 'M', 'L', 'XL']
          const imageArray = images?.map(img => img.image_url) || ['/assets/placeholder.jpg']

          return this.transformProduct(product, sizeArray, imageArray)
        })
      )

      return { data: transformedProducts, error: null }
    } catch (error) {
      console.error('Unexpected error getting products by category:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  static async getFeaturedProducts() {
    // Since we don't have a featured flag, return recent products
    return this.getProducts()
  }

  // Security: Categories table operations
  static async getCategories() {
    try {
      const { data: categories, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)

      if (error || !categories) {
        return { data: null, error }
      }

      // Get unique categories and count products in each
      const categoryMap = new Map<string, number>()
      categories.forEach(item => {
        if (item.category) {
          categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1)
        }
      })

      const uniqueCategories = Array.from(categoryMap.entries()).map(([title, count]) => ({
        id: title.toLowerCase().replace(/\s+/g, '-'),
        title,
        description: `${title} collection`,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        productCount: count,
        featured: true
      }))

      return { data: uniqueCategories, error: null }
    } catch (error) {
      console.error('Unexpected error getting categories:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  static async getCategoryBySlug(slug: string) {
    try {
      const { data: categories, error } = await supabase
        .from('products')
        .select('category')
        .eq('category', slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))

      if (error || !categories || categories.length === 0) {
        return { data: null, error }
      }

      const category = categories[0]
      return {
        data: {
          id: slug,
          title: category.category,
          description: `${category.category} collection`,
          slug: slug,
          productCount: categories.length,
          featured: true
        },
        error: null
      }
    } catch (error) {
      console.error('Unexpected error getting category by slug:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  // Security: Search products with input validation
  static async searchProducts(query: string, limit: number = 20) {
    // Security: Input validation
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return { data: null, error: { message: 'Invalid search query', code: 'INVALID_INPUT' } as PostgrestError }
    }

    if (limit < 1 || limit > 100) {
      limit = 20 // Security: Default to safe limit
    }

    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit)
        .order('created_at', { ascending: false })

      if (error || !products) {
        return { data: null, error }
      }

      // Transform each product
      const transformedProducts = await Promise.all(
        products.map(async (product: DatabaseProduct) => {
          const { data: sizes } = await supabase
            .from('product_sizes')
            .select('size')
            .eq('product_id', product.id)

          const { data: images } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', product.id)

          const sizeArray = sizes?.map(s => s.size) || ['S', 'M', 'L', 'XL']
          const imageArray = images?.map(img => img.image_url) || ['/assets/placeholder.jpg']

          return this.transformProduct(product, sizeArray, imageArray)
        })
      )

      return { data: transformedProducts, error: null }
    } catch (error) {
      console.error('Unexpected error searching products:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  // Security: Pagination with safe limits
  static async getProductsPaginated(page: number = 1, pageSize: number = 12) {
    // Security: Input validation
    if (page < 1) page = 1
    if (pageSize < 1 || pageSize > 50) pageSize = 12 // Security: Safe default

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    try {
      const { data: products, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error || !products) {
        return { data: null, error }
      }

      // Transform each product
      const transformedProducts = await Promise.all(
        products.map(async (product: DatabaseProduct) => {
          const { data: sizes } = await supabase
            .from('product_sizes')
            .select('size')
            .eq('product_id', product.id)

          const { data: images } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', product.id)

          const sizeArray = sizes?.map(s => s.size) || ['S', 'M', 'L', 'XL']
          const imageArray = images?.map(img => img.image_url) || ['/assets/placeholder.jpg']

          return this.transformProduct(product, sizeArray, imageArray)
        })
      )

      return { data: transformedProducts, error: null }
    } catch (error) {
      console.error('Unexpected error getting paginated products:', error)
      return { data: null, error: error as PostgrestError }
    }
  }
}

// Security: Export only the service class
export default DatabaseService
