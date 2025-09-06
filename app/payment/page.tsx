'use client'

import React, { useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { useBuyNow } from "@/context/BuyNowContext";
import Image from "next/image";
import { CartItem } from "@/types";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CreditCard, Banknote, Wallet, FileText, CheckCircle } from "lucide-react";
import { SuccessPopup } from "@/components/SuccessPopup";
import OrderService from "@/lib/order-service";
import DatabaseService from "@/lib/database-service";

export default function PaymentPage() {
  const { cart, clearCart } = useCartContext();
  const { buyNowOrder, isBuyNowMode, clearBuyNowOrder, getOrderSummary } = useBuyNow();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [proofOfPayment, setProofOfPayment] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [showDebug, setShowDebug] = useState(false);

  // Determine which items to show and calculate totals
  let items: CartItem[] = [];
  let subtotal = 0;
  let shipping = 0;
  let total = 0;
  let pageTitle = "Payment";
  let pageDescription = "Complete your payment to finalize your order";

  if (isBuyNowMode && buyNowOrder) {
    // Buy Now Mode - show only the buy now item
    items = [{
      product: buyNowOrder.item.product,
      quantity: buyNowOrder.item.quantity,
      selectedSize: buyNowOrder.item.selectedSize,
      price: buyNowOrder.item.price
    }];
    
    const orderSummary = getOrderSummary();
    if (orderSummary) {
      subtotal = orderSummary.subtotal;
      shipping = orderSummary.shipping;
      total = orderSummary.total;
    }
    
    pageTitle = "Quick Payment";
    pageDescription = "Complete your immediate purchase payment";
  } else {
    // Regular Cart Mode - show all cart items
    items = cart;
    subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    shipping = items.length > 0 ? 100 : 0;
    total = subtotal + shipping;
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProofOfPayment(file);
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (!proofOfPayment) {
      alert('Please upload proof of payment');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Test basic Supabase functionality first
      console.log('Testing basic Supabase functionality...')
      const basicTest = await DatabaseService.testBasicSupabase()
      if (!basicTest.success) {
        console.error('Basic Supabase test failed:', basicTest.error)
        alert('Database connection failed. Please check your Supabase configuration.')
        setIsProcessing(false)
        return
      }

      // Test database connection first
      console.log('Testing database connection...')
      const connectionTest = await DatabaseService.testConnection()
      if (!connectionTest.success) {
        console.error('Database connection failed:', connectionTest.error)
        alert('Database connection failed. Please try again later.')
        setIsProcessing(false)
        return
      }

      // Test if required tables exist
      console.log('Testing table existence...')
      const tableTest = await DatabaseService.testTablesExist()
      console.log('Table test results:', tableTest)
      
      // Test table structure and permissions
      console.log('Testing table structure...')
      const structureTest = await DatabaseService.testTableStructure()
      if (!structureTest.success) {
        console.error('Table structure test failed:', structureTest.error)
        alert('Table structure test failed. Please check your database setup.')
        setIsProcessing(false)
        return
      }

      // Test customer creation with minimal data
      console.log('Testing customer creation...')
      const customerTest = await DatabaseService.testCreateCustomer()
      console.log('Customer test results:', customerTest)

      // Get delivery details from buy now order or localStorage for cart orders
      let deliveryDetails;
      if (isBuyNowMode && buyNowOrder?.deliveryDetails) {
        deliveryDetails = buyNowOrder.deliveryDetails;
        console.log('Using buy now delivery details:', deliveryDetails);
      } else {
        // For cart mode, get delivery details from localStorage
        const storedDeliveryDetails = localStorage.getItem('etheya-delivery-details');
        if (!storedDeliveryDetails) {
          alert('Please complete delivery details first');
          setIsProcessing(false);
          return;
        }
        deliveryDetails = JSON.parse(storedDeliveryDetails);
        console.log('Using localStorage delivery details:', deliveryDetails);
      }
      
      // Validate delivery details
      if (!deliveryDetails || !deliveryDetails.firstName || !deliveryDetails.lastName || 
          !deliveryDetails.phone || !deliveryDetails.address || !deliveryDetails.city || 
          !deliveryDetails.country) {
        console.error('Invalid delivery details:', deliveryDetails);
        alert('Invalid delivery details. Please complete the delivery form again.');
        setIsProcessing(false);
        return;
      }

      // Upload payment proof to storage (you'll need to implement this)
      // For now, we'll use a placeholder URL
      const paymentProofUrl = `payment_proof_${Date.now()}.jpg`;

      // Create the order in the database
      let orderResult;
      if (isBuyNowMode && buyNowOrder) {
        // Single item order
        const singleItem: CartItem = {
          product: buyNowOrder.item.product,
          quantity: buyNowOrder.item.quantity,
          selectedSize: buyNowOrder.item.selectedSize,
          price: buyNowOrder.item.price
        };
        console.log('Creating single item order with:', { deliveryDetails, singleItem, paymentProofUrl });
        orderResult = await OrderService.createSingleItemOrder(
          deliveryDetails,
          singleItem,
          paymentProofUrl
        );
      } else {
        // Cart order
        console.log('=== PAYMENT FLOW DEBUG ===');
        console.log('Delivery details:', deliveryDetails);
        console.log('Cart items:', cart);
        console.log('Cart items count:', cart.length);
        console.log('Payment proof URL:', paymentProofUrl);
        
        // Log each cart item in detail
        cart.forEach((item, index) => {
          console.log(`Cart item ${index + 1}:`, {
            product: item.product,
            productId: item.product.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            price: item.price
          });
        });
        
        console.log('Calling OrderService.createCompleteOrder...');
        orderResult = await OrderService.createCompleteOrder(
          deliveryDetails,
          cart,
          paymentProofUrl
        );
        console.log('OrderService result:', orderResult);
      }

      if (orderResult.error) {
        console.error('=== ORDER CREATION FAILED ===');
        console.error('Order result error:', orderResult.error);
        console.error('Order result details:', orderResult);
        console.error('=== END ORDER CREATION ERROR ===');
        alert('Failed to create order. Please try again.');
        return;
      }

      console.log('Order created successfully:', orderResult);
      
      // Show success popup
      setShowSuccessPopup(true);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    // Clear buy now item when closing the success popup
    if (isBuyNowMode) {
      clearBuyNowOrder();
    }
    
    // Clear cart and delivery details if in regular mode
    if (!isBuyNowMode) {
      clearCart();
      localStorage.removeItem('etheya-delivery-details');
    }
    
    setShowSuccessPopup(false);
  };

  const paymentMethods = [
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      description: 'Transfer to our bank account',
      icon: Banknote,
      details: [
        { label: 'Bank Name', value: 'HBL Bank Pakistan' },
        { label: 'Account Title', value: 'Etheya Fashion Store' },
        { label: 'Account Number', value: '1234-5678-9012-3456' },
        { label: 'IBAN', value: 'PK36HABB0000123456789012' },
        { label: 'Branch Code', value: '1234' },
        { label: 'Swift Code', value: 'HABBPKKA' }
      ]
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      description: 'Mobile wallet payment',
      icon: Wallet,
      details: [
        { label: 'Account Number', value: '0300-1234567' },
        { label: 'Account Title', value: 'Etheya Fashion' },
        { label: 'Account Type', value: 'Business Account' }
      ]
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      description: 'Mobile wallet payment',
      icon: Wallet,
      details: [
        { label: 'Account Number', value: '0300-7654321' },
        { label: 'Account Title', value: 'Etheya Fashion' },
        { label: 'Account Type', value: 'Business Account' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
            <p className="text-gray-600">{pageDescription}</p>
            
            {/* Buy Now Mode Indicator */}
            {isBuyNowMode && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Quick Checkout Mode:</strong> You're purchasing this item immediately without adding it to your cart.
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Payment Method</CardTitle>
                  <CardDescription>Choose your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            selectedPaymentMethod === method.id ? 'bg-blue-500' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              selectedPaymentMethod === method.id ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                          {selectedPaymentMethod === method.id && (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Account Details */}
              {selectedPaymentMethod && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Account Details</CardTitle>
                    <CardDescription>Use these details to complete your payment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {paymentMethods.find(m => m.id === selectedPaymentMethod)?.details.map((detail, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{detail.label}:</span>
                          <span className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border">
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Proof of Payment Upload */}
              {selectedPaymentMethod && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Proof of Payment</CardTitle>
                    <CardDescription>
                      {selectedPaymentMethod === 'bank-transfer' 
                        ? 'Upload screenshot or receipt of your bank transfer'
                        : selectedPaymentMethod === 'easypaisa' || selectedPaymentMethod === 'jazzcash'
                        ? 'Upload screenshot of your mobile wallet payment'
                        : 'Upload proof of your payment'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          id="proof-upload"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label htmlFor="proof-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            {proofOfPayment ? (
                              <span className="text-green-600 font-medium">
                                ✓ {proofOfPayment.name}
                              </span>
                            ) : (
                              <>
                                Click to upload or drag and drop<br />
                                PNG, JPG, PDF up to 10MB
                              </>
                            )}
                          </p>
                        </label>
                      </div>
                      
                      {proofOfPayment && (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-800">{proofOfPayment.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setProofOfPayment(null)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Button */}
              <Button
                onClick={handleSubmitPayment}
                disabled={!selectedPaymentMethod || !proofOfPayment || isProcessing}
                size="lg"
                className="w-full bg-gray-900 text-white hover:bg-gray-800 py-3 text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Complete Payment</span>
                  </div>
                )}
              </Button>
            </div>
            
            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  {isBuyNowMode ? "Quick Purchase Summary" : "Order Summary"}
                </h2>
                
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No items to display</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {items.map((item: CartItem, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="relative w-16 h-16">
                            <Image 
                              src={item.product.image} 
                              alt={item.product.title} 
                              width={64} 
                              height={64} 
                              className="rounded object-cover" 
                            />
                            <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{item.product.title}</div>
                            <div className="text-sm text-gray-500">Size: {item.selectedSize}</div>
                          </div>
                          <div className="font-semibold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>Rs. {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>Rs. {shipping.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t">
                        <span>Total</span>
                        <span>Rs. {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup
          message="Payment Successful!"
          onClose={handleCloseSuccessPopup}
        />
      )}
    </div>
  );
}
