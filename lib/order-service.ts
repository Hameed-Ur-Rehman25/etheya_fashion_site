import DatabaseService from './database-service'
import type { 
  CreateCustomerData, 
  CreateOrderData, 
  CreateOrderItemData,
  Customer,
  Order,
  OrderItem
} from '../types'
import type { CartItem } from '../types'
import type { PostgrestError } from '@supabase/supabase-js'

export interface OrderCreationResult {
  customer: Customer | null
  order: Order | null
  orderItems: OrderItem[] | null
  error: PostgrestError | null
}

export interface DeliveryDetails {
  email: string
  firstName: string
  lastName: string
  country: string
  address: string
  city: string
  phone: string
  apartment?: string
  postalCode?: string
}

export class OrderService {
  /**
   * Creates a complete order with customer, order, and order items
   */
  static async createCompleteOrder(
    deliveryDetails: DeliveryDetails,
    items: CartItem[],
    paymentProofUrl?: string
  ): Promise<OrderCreationResult> {
    try {
      // Step 1: Create customer
      const customerData: CreateCustomerData = {
        email: deliveryDetails.email,
        phone: deliveryDetails.phone,
        first_name: deliveryDetails.firstName,
        last_name: deliveryDetails.lastName,
        address: deliveryDetails.address,
        apartment: deliveryDetails.apartment,
        city: deliveryDetails.city,
        postal_code: deliveryDetails.postalCode,
        country: deliveryDetails.country
      }

      const { data: customer, error: customerError } = await DatabaseService.createCustomer(customerData)
      
      if (customerError || !customer) {
        console.error('Failed to create customer:', customerError)
        console.error('Customer data that failed:', customerData)
        return { customer: null, order: null, orderItems: null, error: customerError }
      }

      // Step 2: Calculate order totals
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const shippingCost = 250 // Fixed shipping cost
      const total = subtotal + shippingCost

      // Step 3: Create order
      const orderData: CreateOrderData = {
        customer_id: customer.id,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total: total,
        shipping_method: 'Standard Shipping',
        status: 'pending',
        payment_proof_url: paymentProofUrl
      }

      const { data: order, error: orderError } = await DatabaseService.createOrder(orderData)
      
      if (orderError || !order) {
        console.error('Failed to create order:', orderError)
        console.error('Order data that failed:', orderData)
        return { customer, order: null, orderItems: null, error: orderError }
      }

      // Step 4: Create order items
      console.log('Creating order items for cart items:', items)
      
      // Get the first available product ID from database as fallback
      const fallbackProductId = await DatabaseService.getFirstAvailableProductId()
      if (!fallbackProductId) {
        console.error('No products found in database. Cannot create order items.')
        return { customer, order, orderItems: null, error: { message: 'No products available in database', code: 'NO_PRODUCTS' } as any }
      }
      
      const orderItemsData: CreateOrderItemData[] = []
      
      for (const item of items) {
        // Convert product ID to UUID format
        const productUuid = DatabaseService.convertProductIdToUuid(item.product.id)
        console.log(`Converting product ID ${item.product.id} to UUID: ${productUuid}`)
        
        // Check if the converted product ID exists in database
        const productExists = await DatabaseService.checkProductExists(productUuid)
        
        let finalProductId = productUuid
        if (!productExists) {
          console.warn(`Product ID ${productUuid} does not exist in database. Using fallback product ID: ${fallbackProductId}`)
          finalProductId = fallbackProductId
        }
        
        orderItemsData.push({
          order_id: order.id,
          product_id: finalProductId,
          size: (item.selectedSize as 'S' | 'M' | 'L' | 'XL') || 'M',
          quantity: item.quantity,
          price: item.price
        })
      }
      
      console.log('Final order items data to be inserted:', orderItemsData)

      const { data: orderItems, error: orderItemsError } = await DatabaseService.createOrderItems(orderItemsData)
      
      if (orderItemsError || !orderItems) {
        console.error('Failed to create order items:', orderItemsError)
        return { customer, order, orderItems: null, error: orderItemsError }
      }

      return { customer, order, orderItems, error: null }

    } catch (error) {
      console.error('Unexpected error creating complete order:', error)
      return { 
        customer: null, 
        order: null, 
        orderItems: null, 
        error: error as PostgrestError 
      }
    }
  }

  /**
   * Creates a single item order (for buy now functionality)
   */
  static async createSingleItemOrder(
    deliveryDetails: DeliveryDetails,
    item: CartItem,
    paymentProofUrl?: string
  ): Promise<OrderCreationResult> {
    return this.createCompleteOrder(deliveryDetails, [item], paymentProofUrl)
  }
}

export default OrderService
