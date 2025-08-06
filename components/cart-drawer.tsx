'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const cartItems = [
  {
    id: 1,
    title: 'Embroidered Lawn Suit',
    price: 7560,
    quantity: 2,
    image: '/placeholder.svg?height=100&width=100',
    size: 'M'
  },
  {
    id: 2,
    title: 'Silk Formal Dress',
    price: 12500,
    quantity: 1,
    image: '/placeholder.svg?height=100&width=100',
    size: 'L'
  }
]

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState(cartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setItems(items.filter(item => item.id !== id))
    } else {
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl font-playfair font-bold">Shopping Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="text-lg font-bold text-gray-900">Rs. {item.price.toLocaleString()}</p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
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
          {items.length > 0 && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold">Rs. {total.toLocaleString()}</span>
              </div>
              
              <Button
                size="lg"
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
