import { supabase } from './supabase'
import type { PostgrestError } from '@supabase/supabase-js'
import type { 
  Customer, 
  CreateCustomerData, 
  Order, 
  CreateOrderData, 
  OrderItem, 
  CreateOrderItemData 
} from '../types'

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
  sub_category: string | null
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
      subCategory: dbProduct.sub_category || 'Uncategorized',
      inStock: true, // Default to true since we don't have stock tracking
      featured: false // Default to false since we don't have featured flag
    }
  }

  // Helper function to convert frontend product ID (number) to backend UUID
  static convertProductIdToUuid(productId: number): string {
    const hexId = productId.toString(16).padStart(32, '0')
    return `${hexId.slice(0, 8)}-${hexId.slice(8, 12)}-${hexId.slice(12, 16)}-${hexId.slice(16, 20)}-${hexId.slice(20, 32)}`
  }

  // Helper function to get the first available product ID from database
  static async getFirstAvailableProductId(): Promise<string | null> {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('id')
        .limit(1)

      if (error || !products || products.length === 0) {
        console.error('No products found in database:', error)
        return null
      }

      return products[0].id
    } catch (error) {
      console.error('Error getting first product ID:', error)
      return null
    }
  }

  // Helper function to check if a product ID exists in database
  static async checkProductExists(productId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .eq('id', productId)
        .limit(1)

      if (error) {
        console.error('Error checking product existence:', error)
        return false
      }

      return data && data.length > 0
    } catch (error) {
      console.error('Error checking product existence:', error)
      return false
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

  static async getProductsBySubCategory(subCategory: string) {
    try {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('sub_category', subCategory)
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
      console.error('Unexpected error getting products by sub-category:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  static async getProductsByCategoryAndSubCategory(category: string, subCategory: string) {
    try {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('sub_category', subCategory)
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
      console.error('Unexpected error getting products by category and sub-category:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  static async getProductsWithFilters(filters: {
    categories?: string[]
    subCategories?: string[]
    sizes?: string[]
    priceRange?: [number, number]
  }) {
    try {
      let query = supabase
        .from('products')
        .select('*')

      // Apply category filter
      if (filters.categories && filters.categories.length > 0) {
        query = query.in('category', filters.categories)
      }

      // Apply sub-category filter
      if (filters.subCategories && filters.subCategories.length > 0) {
        query = query.in('sub_category', filters.subCategories)
      }

      // Apply price range filter
      if (filters.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1])
      }

      const { data: products, error: productsError } = await query
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

      // Apply size filter after transformation (since sizes are in a separate table)
      let filteredProducts = transformedProducts
      if (filters.sizes && filters.sizes.length > 0) {
        filteredProducts = transformedProducts.filter(product => 
          product.sizes.some(size => filters.sizes!.includes(size))
        )
      }

      return { data: filteredProducts, error: null }
    } catch (error) {
      console.error('Unexpected error getting products with filters:', error)
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

  static async getSubCategories() {
    try {
      const { data: subCategories, error } = await supabase
        .from('products')
        .select('sub_category')
        .not('sub_category', 'is', null)

      if (error || !subCategories) {
        return { data: null, error }
      }

      // Get unique sub-categories and count products in each
      const subCategoryMap = new Map<string, number>()
      subCategories.forEach(item => {
        if (item.sub_category) {
          subCategoryMap.set(item.sub_category, (subCategoryMap.get(item.sub_category) || 0) + 1)
        }
      })

      const uniqueSubCategories = Array.from(subCategoryMap.entries()).map(([title, count]) => ({
        id: title.toLowerCase().replace(/\s+/g, '-'),
        title,
        description: `${title} collection`,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        productCount: count,
        featured: true
      }))

      return { data: uniqueSubCategories, error: null }
    } catch (error) {
      console.error('Unexpected error getting sub-categories:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  // Get categories with images from dedicated categories table
  static async getCategoriesWithImages() {
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error fetching categories with images:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        
        // If table doesn't exist (code 42P01), fall back to product-based categories
        if (error.code === '42P01') {
          console.warn('Categories table does not exist, falling back to product-based categories')
          return this.getCategories()
        }
        
        return { data: null, error }
      }

      if (!categories || categories.length === 0) {
        console.warn('No categories found in categories table, falling back to product-based categories')
        return this.getCategories()
      }

      // Transform categories to match the expected format
      const transformedCategories = categories.map(category => ({
        id: category.id,
        title: category.title,
        description: category.description || `${category.title} collection`,
        slug: category.slug,
        image: category.image_url || '/assets/placeholder.jpg',
        productCount: 0, // We'll calculate this separately if needed
        featured: true
      }))

      return { data: transformedCategories, error: null }
    } catch (error) {
      console.error('Unexpected error getting categories with images:', error)
      // Fall back to product-based categories on any unexpected error
      console.warn('Falling back to product-based categories due to unexpected error')
      return this.getCategories()
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

  // Customer storage operations
  static async createCustomer(customerData: CreateCustomerData) {
    try {
      console.log('Creating customer with data:', customerData)
      
      // Validate required fields
      if (!customerData.phone || !customerData.first_name || !customerData.last_name || 
          !customerData.address || !customerData.city || !customerData.country) {
        const error = new Error('Missing required customer fields')
        console.error('Validation error:', error.message)
        return { data: null, error: error as PostgrestError }
      }
      
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error creating customer:', error)
        console.error('Error message:', error.message)
        console.error('Error code:', error.code)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        
        // Create a clean error object for logging
        const cleanError = {
          message: error.message || 'Unknown error',
          code: error.code || 'UNKNOWN',
          details: error.details || null,
          hint: error.hint || null
        }
        console.error('Clean error object:', cleanError)
        
        return { data: null, error }
      }

      console.log('Customer created successfully:', data)
      return { data: data as Customer, error: null }
    } catch (error) {
      console.error('Unexpected error creating customer:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  // Order storage operations
  static async createOrder(orderData: CreateOrderData) {
    try {
      console.log('Creating order with data:', orderData)
      
      // Validate required fields
      if (!orderData.customer_id || !orderData.subtotal || !orderData.total) {
        const error = new Error('Missing required order fields')
        console.error('Validation error:', error.message)
        return { data: null, error: error as PostgrestError }
      }
      
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error creating order:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        return { data: null, error }
      }

      console.log('Order created successfully:', data)
      return { data: data as Order, error: null }
    } catch (error) {
      console.error('Unexpected error creating order:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  // Order item storage operations
  static async createOrderItem(orderItemData: CreateOrderItemData) {
    try {
      console.log('Creating order item with data:', orderItemData)
      
      const { data, error } = await supabase
        .from('order_items')
        .insert([orderItemData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error creating order item:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        return { data: null, error }
      }

      console.log('Order item created successfully:', data)
      return { data: data as OrderItem, error: null }
    } catch (error) {
      console.error('Unexpected error creating order item:', error)
      return { data: null, error: error as PostgrestError }
    }
  }

  // Batch create order items for multiple products
  static async createOrderItems(orderItemsData: CreateOrderItemData[]) {
    try {
      console.log('=== CREATE ORDER ITEMS DEBUG ===')
      console.log('Input data:', JSON.stringify(orderItemsData, null, 2))
      
      // Validate input data
      if (!orderItemsData || orderItemsData.length === 0) {
        console.error('No order items data provided')
        return { data: null, error: { message: 'No order items data provided', code: 'INVALID_INPUT' } as PostgrestError }
      }

      // Check each order item data
      for (let i = 0; i < orderItemsData.length; i++) {
        const item = orderItemsData[i]
        console.log(`Order item ${i + 1}:`, {
          order_id: item.order_id,
          product_id: item.product_id,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })
        
        // Validate required fields
        if (!item.order_id) {
          console.error(`Order item ${i + 1} missing order_id`)
        }
        if (!item.product_id) {
          console.error(`Order item ${i + 1} missing product_id`)
        }
        if (!item.size) {
          console.error(`Order item ${i + 1} missing size`)
        }
        if (!item.quantity || item.quantity <= 0) {
          console.error(`Order item ${i + 1} invalid quantity:`, item.quantity)
        }
        if (!item.price || item.price <= 0) {
          console.error(`Order item ${i + 1} invalid price:`, item.price)
        }
      }
      
      console.log('Attempting to insert order items into database...')
      const { data, error } = await supabase
        .from('order_items')
        .insert(orderItemsData)
        .select()

      if (error) {
        console.error('=== SUPABASE ERROR DETAILS ===')
        console.error('Error message:', error.message)
        console.error('Error code:', error.code)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        console.error('Full error object:', error)
        console.error('=== END ERROR DETAILS ===')
        return { data: null, error }
      }

      console.log('Order items created successfully:', data)
      console.log('=== END CREATE ORDER ITEMS DEBUG ===')
      return { data: data as OrderItem[], error: null }
    } catch (error) {
      console.error('=== UNEXPECTED ERROR IN CREATE ORDER ITEMS ===')
      console.error('Error type:', typeof error)
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
      console.error('Full error:', error)
      console.error('=== END UNEXPECTED ERROR ===')
      return { data: null, error: error as PostgrestError }
    }
  }






}

// Security: Export only the service class
export default DatabaseService
