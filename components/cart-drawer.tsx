'use client'

import { useCartContext } from '@/context/CartContext'
import Image from 'next/image'
import { X, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/src/shared/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/src/shared/components/ui/sheet'
import { useRouter } from 'next/navigation'

// Removed static cartItems, using context instead


interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, addToCart, clearCart } = useCartContext();
  const router = useRouter();

  const updateQuantity = (productId: number, selectedSize: string | undefined, newQuantity: number) => {
    const item = cart.find(item => item.product.id === productId && item.selectedSize === selectedSize);
    if (!item) return;
    if (newQuantity === 0) {
      // Remove item by setting quantity to 0
      clearCart();
      cart.filter(i => !(i.product.id === productId && i.selectedSize === selectedSize)).forEach(i => addToCart(i.product, i.quantity, i.selectedSize));
    } else {
      clearCart();
      cart.map(i => {
        if (i.product.id === productId && i.selectedSize === selectedSize) {
          addToCart(i.product, newQuantity, i.selectedSize);
        } else {
          addToCart(i.product, i.quantity, i.selectedSize);
        }
      });
    }
  };

  const removeItem = (productId: number, selectedSize: string | undefined) => {
    clearCart();
    cart.filter(i => !(i.product.id === productId && i.selectedSize === selectedSize)).forEach(i => addToCart(i.product, i.quantity, i.selectedSize));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleContinueShopping = () => {
    onClose();
    router.push('/products');
  };

  const handleCheckout = () => {
    onClose();
    router.push('/delivery-details');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl font-playfair font-bold">Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">Your cart is empty</p>
                <Button
                  onClick={handleContinueShopping}
                  className="fill-button bg-gray-900 text-white hover:bg-gray-800"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div key={item.product.id + '-' + (item.selectedSize || '') + '-' + idx} className="flex items-center space-x-4">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.title}
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                      <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                      <p className="text-lg font-bold text-gray-900">Rs. {item.price.toLocaleString()}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id, item.selectedSize)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold">Rs. {total.toLocaleString()}</span>
              </div>
              
              {/* Continue Shopping Button */}
              <Button
                variant="outline"
                onClick={handleContinueShopping}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 text-lg font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
              
              {/* Checkout Button */}
              <Button
                size="lg"
                onClick={handleCheckout}
                className="w-full fill-button bg-gray-900 text-white hover:bg-gray-800 py-3 text-lg font-medium"
              >
                Checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
