'use client'

import { Navbar } from '@/shared/components/layout/navbar'
import { WishlistGrid } from '@/features/wishlist'
import { useWishlist } from '@/features/wishlist'
import { useCart } from '@/features/cart'
import { CartDrawer } from '@/features/cart'
import { SearchModal } from '@/components/search-modal'
import { Footer } from '@/components/footer'
import { SectionContainer } from '@/components/section-container'
import { Button } from '@/shared/components/ui/button'
import { ShoppingCart, Heart } from 'lucide-react'
import { useState } from 'react'

export default function WishlistPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const wishlist = useWishlist()
  const cart = useCart()

  const handleAddToCart = (product: any, size?: string) => {
    cart.addItem(product, size)
    // Optional: Remove from wishlist after adding to cart
    // wishlist.removeItem(product.id)
  }

  const handleRemoveFromWishlist = (productId: number) => {
    wishlist.removeItem(productId)
  }

  const handleToggleWishlist = (product: any) => {
    wishlist.toggleItem(product)
  }

  const handleClearWishlist = () => {
    wishlist.clearWishlist()
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        cartItemCount={cart.itemCount}
        wishlistItemCount={wishlist.itemCount}
        onSearchToggle={() => setIsSearchOpen(true)}
        onCartToggle={cart.toggleCart}
        onWishlistClick={() => {}} // Already on wishlist page
      />
      
      <main className="pt-16">
        <SectionContainer>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 fill-red-500 text-red-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {wishlist.itemCount > 0 
                  ? `You have ${wishlist.itemCount} item${wishlist.itemCount > 1 ? 's' : ''} in your wishlist`
                  : 'Your wishlist is empty'
                }
              </p>
            </div>

            {wishlist.itemCount > 0 && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleClearWishlist}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Clear All
                </Button>
                
                <Button
                  onClick={() => {
                    // Add all wishlist items to cart
                    wishlist.wishlist.items.forEach(item => {
                      cart.addItem(item.product)
                    })
                  }}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add All to Cart
                </Button>
              </div>
            )}
          </div>

          {/* Wishlist Content */}
          {wishlist.isEmpty ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Start adding items to save them for later!</p>
              <Button 
                onClick={() => window.location.href = '/products'}
                className="bg-black text-white hover:bg-gray-800"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <WishlistGrid
              items={wishlist.wishlist.items}
              onRemoveItem={handleRemoveFromWishlist}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              loading={wishlist.loading}
              columns={3}
            />
          )}
        </SectionContainer>
      </main>

      <Footer />

      {/* Modals and Drawers */}
      <CartDrawer
        isOpen={cart.isOpen}
        onClose={cart.closeCart}
        items={cart.cart.items}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
        totalPrice={cart.cart.totalPrice}
        totalItems={cart.cart.totalItems}
        loading={cart.loading}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  )
}
