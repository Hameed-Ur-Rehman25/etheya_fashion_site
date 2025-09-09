'use client'

import React, { useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { useBuyNow } from "@/context/BuyNowContext";
import Image from "next/image";
import { CartItem } from "@/types";
import { Navbar } from "@/components/navbar";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Label } from "@/src/shared/components/ui/label";
import { Checkbox } from "@/src/shared/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function DeliveryDetailsPage() {
  const { cart } = useCartContext();
  const { buyNowOrder, isBuyNowMode, setDeliveryDetails, getOrderSummary } = useBuyNow();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    country: '',
    address: '',
    city: '',
    phone: '',
    apartment: '',
    postalCode: ''
  });

  // Form validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine which items to show and calculate totals
  let items: CartItem[] = [];
  let subtotal = 0;
  let shipping = 0;
  let total = 0;
  let pageTitle = "Checkout";
  let pageDescription = "Complete your order with delivery details";

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
    
    pageTitle = "Quick Checkout";
    pageDescription = "Complete your immediate purchase";
  } else {
    // Regular Cart Mode - show all cart items
    items = cart;
    subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    shipping = items.length > 0 ? 250 : 0;
    total = subtotal + shipping;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Required field validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    const deliveryDetails = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      country: formData.country,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      apartment: formData.apartment,
      postalCode: formData.postalCode
    };
    
    // Store delivery details in buy now order if in buy now mode
    if (isBuyNowMode && buyNowOrder) {
      setDeliveryDetails(deliveryDetails);
    } else {
      // For cart mode, store delivery details in localStorage
      localStorage.setItem('etheya-delivery-details', JSON.stringify(deliveryDetails));
    }
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Navigate to payment page
      router.push('/payment');
    }, 1000);
  };

  const isFormValid = () => {
    return formData.email && formData.firstName && formData.lastName && 
           formData.country && formData.address && formData.city && formData.phone;
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
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email or mobile phone number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`mt-1 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your email or phone"
                  />
                  {errors.email && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
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
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger className={`mt-1 ${errors.country ? 'border-red-500 focus:ring-red-500' : ''}`}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pakistan">Pakistan</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="bangladesh">Bangladesh</SelectItem>
                      <SelectItem value="sri-lanka">Sri Lanka</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.country}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`mt-1 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="First name"
                    />
                    {errors.firstName && (
                      <div className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.firstName}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`mt-1 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Last name"
                    />
                    {errors.lastName && (
                      <div className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`mt-1 ${errors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Street address"
                  />
                  {errors.address && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.address}
                    </div>
                    )}
                </div>
                
                <div>
                  <Label htmlFor="apartment" className="text-sm font-medium text-gray-700">
                    Apartment, suite, etc. (optional)
                  </Label>
                  <Input
                    id="apartment"
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    placeholder="Apartment, suite, etc."
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`mt-1 ${errors.city ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="City"
                    />
                    {errors.city && (
                      <div className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.city}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                      Postal code (optional)
                    </Label>
                    <Input
                      id="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="Postal code"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`mt-1 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Phone number"
                  />
                  {errors.phone && (
                    <div className="flex items-center mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </div>
                  )}
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
                  <span className="font-semibold text-gray-900">Rs. 250.00</span>
                </div>
                
                <Button
                  type="button"
                  size="lg"
                  onClick={handleProceedToPayment}
                  disabled={!isFormValid() || isSubmitting}
                  className="w-full mt-8 bg-gray-900 text-white hover:bg-gray-800 py-3 text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>Proceed to Payment</span>
                  )}
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
  
