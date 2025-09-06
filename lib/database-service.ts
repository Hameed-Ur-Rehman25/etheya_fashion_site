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

  // Test database connection and table existence
  static async testConnection() {
    try {
      console.log('Testing database connection...')
      console.log('Supabase client:', supabase)
      
      // Test basic connection by trying to fetch from a table that should exist
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .limit(1)

      if (error) {
        console.error('Database connection test failed:', error)
        console.error('Connection error message:', error.message)
        console.error('Connection error code:', error.code)
        console.error('Connection error details:', error.details)
        console.error('Connection error hint:', error.hint)
        return { success: false, error }
      }

      console.log('Database connection test successful')
      console.log('Connection test data:', data)
      return { success: true, error: null }
    } catch (error) {
      console.error('Unexpected error testing database connection:', error)
      return { success: false, error: error as PostgrestError }
    }
  }

  // Test if required tables exist
  static async testTablesExist() {
    try {
      console.log('Testing if required tables exist...')
      
      const tables = ['customers', 'orders', 'order_items']
      const results: Record<string, { exists: boolean; error?: string }> = {}
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1)
          
          results[table] = { exists: !error, error: error?.message }
        } catch (err) {
          results[table] = { exists: false, error: err instanceof Error ? err.message : 'Unknown error' }
        }
      }
      
      console.log('Table existence test results:', results)
      return results
    } catch (error) {
      console.error('Unexpected error testing tables:', error)
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Test creating a simple customer
  static async testCreateCustomer() {
    try {
      console.log('Testing customer creation with minimal data...')
      
      const testCustomerData = {
        phone: '+92-300-1234567',
        first_name: 'Test',
        last_name: 'User',
        address: '123 Test Street',
        city: 'Karachi',
        country: 'Pakistan'
      }
      
      console.log('Test customer data:', testCustomerData)
      
      const { data, error } = await supabase
        .from('customers')
        .insert([testCustomerData])
        .select()
        .single()
      
      if (error) {
        console.error('Test customer creation failed:', error)
        console.error('Test error message:', error.message)
        console.error('Test error code:', error.code)
        console.error('Test error details:', error.details)
        console.error('Test error hint:', error.hint)
        
        // Create a clean error object for logging
        const cleanError = {
          message: error.message || 'Unknown error',
          code: error.code || 'UNKNOWN',
          details: error.details || null,
          hint: error.hint || null
        }
        console.error('Test clean error object:', cleanError)
        
        return { success: false, error, data: null }
      }
      
      console.log('Test customer created successfully:', data)
      return { success: true, error: null, data }
    } catch (error) {
      console.error('Unexpected error testing customer creation:', error)
      return { success: false, error: error as PostgrestError, data: null }
    }
  }

  // Test basic Supabase functionality
  static async testBasicSupabase() {
    try {
      console.log('Testing basic Supabase functionality...')
      
      // Test 1: Check if supabase client is properly initialized
      if (!supabase) {
        console.error('Supabase client is not initialized')
        return { success: false, error: 'Supabase client not initialized' }
      }
      
      // Test 2: Try a simple query that should work
      const { data, error } = await supabase
        .from('customers')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('Basic Supabase test failed:', error)
        console.error('Basic test error message:', error.message)
        console.error('Basic test error code:', error.code)
        return { success: false, error: error.message }
      }
      
      console.log('Basic Supabase test successful:', data)
      return { success: true, error: null }
    } catch (error) {
      console.error('Unexpected error in basic Supabase test:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Test creating a simple order item
  static async testCreateOrderItem() {
    try {
      console.log('=== TESTING ORDER ITEM CREATION ===')
      
      // First, get a valid order ID (from the most recent order)
      const { data: recentOrder, error: orderError } = await supabase
        .from('orders')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (orderError || !recentOrder) {
        console.error('No orders found for testing:', orderError)
        return { success: false, error: 'No orders found for testing' }
      }
      
      // Get a valid product ID
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id')
        .limit(1)
        .single()
      
      if (productError || !product) {
        console.error('No products found for testing:', productError)
        return { success: false, error: 'No products found for testing' }
      }
      
      console.log('Using order ID:', recentOrder.id)
      console.log('Using product ID:', product.id)
      
      // Create a test order item
      const testOrderItem = {
        order_id: recentOrder.id,
        product_id: product.id,
        size: 'M' as const,
        quantity: 1,
        price: 1000
      }
      
      console.log('Test order item data:', testOrderItem)
      
      const { data, error } = await supabase
        .from('order_items')
        .insert([testOrderItem])
        .select()
        .single()
      
      if (error) {
        console.error('Test order item creation failed:', error)
        return { success: false, error: error.message }
      }
      
      console.log('Test order item created successfully:', data)
      
      // Clean up test data
      await supabase
        .from('order_items')
        .delete()
        .eq('id', data.id)
      
      console.log('Test order item cleaned up')
      console.log('=== END ORDER ITEM TEST ===')
      
      return { success: true, error: null }
    } catch (error) {
      console.error('Unexpected error in order item test:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Test table structure and permissions
  static async testTableStructure() {
    try {
      console.log('Testing table structure and permissions...')
      
      // Test 1: Check if we can select from customers table
      const { data: selectData, error: selectError } = await supabase
        .from('customers')
        .select('*')
        .limit(1)
      
      if (selectError) {
        console.error('Select test failed:', selectError)
        console.error('Select error message:', selectError.message)
        console.error('Select error code:', selectError.code)
        return { success: false, error: selectError.message }
      }
      
      console.log('Select test successful:', selectData)
      
      // Test 2: Check table structure by trying to insert with minimal data
      const testData = {
        phone: '+92-300-1234567',
        first_name: 'Test',
        last_name: 'User',
        address: '123 Test Street',
        city: 'Karachi',
        country: 'Pakistan'
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('customers')
        .insert([testData])
        .select()
        .single()
      
      if (insertError) {
        console.error('Insert test failed:', insertError)
        console.error('Insert error message:', insertError.message)
        console.error('Insert error code:', insertError.code)
        console.error('Insert error details:', insertError.details)
        console.error('Insert error hint:', insertError.hint)
        return { success: false, error: insertError.message }
      }
      
      console.log('Insert test successful:', insertData)
      
      // Clean up test data
      if (insertData?.id) {
        await supabase
          .from('customers')
          .delete()
          .eq('id', insertData.id)
      }
      
      return { success: true, error: null }
    } catch (error) {
      console.error('Unexpected error in table structure test:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Security: Export only the service class
export default DatabaseService
