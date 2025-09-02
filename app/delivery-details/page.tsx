'use client'

import React from "react";
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

export default function DeliveryDetailsPage() {
  const { cart, clearCart } = useCartContext();
  const { buyNowItem, isBuyNowMode, clearBuyNowItem } = useBuyNow();

  // Determine which items to show and calculate totals
  let items: CartItem[] = [];
  let subtotal = 0;
  let shipping = 0;
  let total = 0;
  let pageTitle = "Checkout";
  let pageDescription = "Complete your order with delivery details";

  if (isBuyNowMode && buyNowItem) {
    // Buy Now Mode - show only the buy now item
    items = [{
      product: buyNowItem.product,
      quantity: buyNowItem.quantity,
      selectedSize: buyNowItem.selectedSize,
      price: buyNowItem.price
    }];
    subtotal = buyNowItem.price * buyNowItem.quantity;
    pageTitle = "Quick Checkout";
    pageDescription = "Complete your immediate purchase";
  } else {
    // Regular Cart Mode - show all cart items
    items = cart;
    subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  shipping = items.length > 0 ? 100 : 0;
  total = subtotal + shipping;

  const handleProceedToPayment = () => {
    // Clear buy now item if in buy now mode
    if (isBuyNowMode) {
      clearBuyNowItem();
    }
    
    // TODO: Implement payment logic
    console.log('Proceeding to payment...');
  };

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
            {/* Left: Delivery Form */}
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Contact Information</h2>
              <form className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email or mobile phone number
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email or phone"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="news" />
                  <Label htmlFor="news" className="text-sm text-gray-700">
                    Email me with news and offers
                  </Label>
                </div>
                
                <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-900">Delivery Address</h2>
                
                <div>
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                    Country
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pakistan">Pakistan</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="bangladesh">Bangladesh</SelectItem>
                      <SelectItem value="sri-lanka">Sri Lanka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Street address"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="apartment" className="text-sm font-medium text-gray-700">
                    Apartment, suite, etc. (optional)
                  </Label>
                  <Input
                    id="apartment"
                    type="text"
                    placeholder="Apartment, suite, etc."
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="City"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                      Postal code (optional)
                    </Label>
                    <Input
                      id="postalCode"
                      type="text"
                      placeholder="Postal code"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="saveInfo" />
                  <Label htmlFor="saveInfo" className="text-sm text-gray-700">
                    Save this information for next time
                  </Label>
                </div>
                
                <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">Shipping Method</h2>
                <div className="border rounded-lg px-4 py-3 bg-green-50 flex justify-between items-center">
                  <span className="text-gray-900">Standard Shipping</span>
                  <span className="font-semibold text-gray-900">Rs. 100.00</span>
                </div>
                
                <Button
                  type="button"
                  size="lg"
                  onClick={handleProceedToPayment}
                  className="w-full mt-8 bg-gray-900 text-white hover:bg-gray-800 py-3 text-lg font-medium transition-colors"
                >
                  Proceed to Payment
                </Button>
              </form>
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
    </div>
  );
}
  
