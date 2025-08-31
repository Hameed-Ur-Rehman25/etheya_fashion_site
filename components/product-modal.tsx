'use client'

import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { useCartContext } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import Image from 'next/image'
import { X, Heart, Plus, Minus, ShoppingBag, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Product } from '@/types'
import { formatPrice } from '@/lib/product-utils'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}


export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [openSections, setOpenSections] = useState<string[]>([])

  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCartContext();

  if (!product) return null;

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedSize);
    toast({
      title: 'Added to Cart',
      description: `${product.title} (${selectedSize}) x${quantity} added to your cart.`,
      variant: 'default',
    });
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    console.log('Buy now:', { product, selectedSize, quantity });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">{product.title}</DialogTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Side - Image Section */}
          <div className="relative bg-gray-50">
            {/* Main Image */}
            <div className="relative aspect-square">
              <Image
                src={product.images?.[currentImageIndex] || product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
              />
              
            </div>
            
            {/* Thumbnail Navigation */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-black' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Side - Product Details */}
          <div className="p-6 lg:p-8">
            
            {/* Product Title */}
            <h1 className="text-2xl lg:text-3xl font-light text-gray-900 mb-2 tracking-wide">
              {product.title}
            </h1>
            
            {/* Product Type */}
            <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide">
              3 PIECES
            </p>
            
            {/* SKU */}
            <p className="text-xs text-gray-500 mb-4">
              SKU: {product.id || 'J2-RTW-1210-1-S'}
            </p>
            
            {/* Price */}
            <p className="text-2xl font-medium text-gray-900 mb-6">
              {formatPrice(product.price)}
            </p>
            
            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size:</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] h-10 ${
                      selectedSize === size 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-black border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Quantity and Size Chart */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decreaseQuantity}
                  className="h-8 w-8 border-gray-300"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="mx-3 text-lg font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increaseQuantity}
                  className="h-8 w-8 border-gray-300"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              
              <Button variant="link" className="text-sm text-gray-600 p-0 h-auto">
                Size Chart
              </Button>
            </div>
            
            {/* Wishlist */}
            <div className="flex items-center justify-end mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => product && toggleWishlist(product)}
                className="text-gray-600 hover:text-black"
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    product && isWishlisted(product.id) ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                Add to Wishlist
              </Button>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || !selectedSize}
                className="w-full bg-white text-black border border-black hover:bg-black hover:text-white transition-all duration-300 py-3 uppercase tracking-wide"
              >
                Add to Cart
              </Button>
              
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock || !selectedSize}
                className="w-full bg-black text-white hover:bg-gray-800 py-3 uppercase tracking-wide"
              >
                Buy It Now
              </Button>
            </div>
            
            {/* Expandable Sections */}
            <div className="space-y-3 border-t pt-6">
              {/* Description */}
              <Collapsible 
                open={openSections.includes('description')} 
                onOpenChange={() => toggleSection('description')}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                      Description
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        openSections.includes('description') ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="py-4 text-sm text-gray-600 leading-relaxed">
                    {product.description || "Premium quality embroidered lawn outfit with elegant design and comfortable fit."}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Product Information */}
              <Collapsible 
                open={openSections.includes('info')} 
                onOpenChange={() => toggleSection('info')}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                      Product Information
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        openSections.includes('info') ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="py-4 text-sm text-gray-600 space-y-2">
                    <p>• Premium lawn fabric</p>
                    <p>• Embroidered design</p>
                    <p>• 3-piece set</p>
                    <p>• Machine washable</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Shipping Information */}
              <Collapsible 
                open={openSections.includes('shipping')} 
                onOpenChange={() => toggleSection('shipping')}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                      Shipping Information
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        openSections.includes('shipping') ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="py-4 text-sm text-gray-600 space-y-2">
                    <p>• Free shipping on orders over Rs. 5,000</p>
                    <p>• Standard delivery: 3-5 business days</p>
                    <p>• Express delivery available</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Model Size */}
              <Collapsible 
                open={openSections.includes('model')} 
                onOpenChange={() => toggleSection('model')}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                      Model Size
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        openSections.includes('model') ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="py-4 text-sm text-gray-600">
                    <p>Model is wearing size M</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              {/* Please Note */}
              <Collapsible 
                open={openSections.includes('note')} 
                onOpenChange={() => toggleSection('note')}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                      Please Note
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        openSections.includes('note') ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="py-4 text-sm text-gray-600 space-y-2">
                    <p>• Colors may vary slightly due to screen settings</p>
                    <p>• Size chart is for reference only</p>
                    <p>• Exchange/return policy applies</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
