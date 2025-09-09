'use client'

import { useState, useMemo } from 'react'
import { Heart, ShoppingCart, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { SimpleProductGrid } from '@/components/simple-product-grid'
import { ProductModal } from '@/components/product-modal'
import { ProductFilterSidebar } from '@/components/product-filter-sidebar'
import { useWishlist } from '../../context/WishlistContext'
import { useCartContext } from '../../context/CartContext'
import { useRouter } from 'next/navigation'
import { Product, SearchFilters } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { filterProducts, sortProducts } from '@/lib/product-utils'
import { SORT_OPTIONS, PRICE_RANGES } from '@/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function WishlistPage() {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCartContext();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    subCategories: [],
    sizes: [],
    availability: [],
    types: [],
    fabrics: [],
    pieces: [],
    priceRange: [PRICE_RANGES.MIN, PRICE_RANGES.MAX],
    sortBy: 'newest'
  });
  const { toast } = useToast();

  // Apply filters and sorting to wishlist items
  const filteredAndSortedWishlist = useMemo(() => {
    const filtered = filterProducts(wishlist, filters);
    return sortProducts(filtered, filters.sortBy);
  }, [wishlist, filters]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      subCategories: [],
      sizes: [],
      availability: [],
      types: [],
      fabrics: [],
      pieces: [],
      priceRange: [PRICE_RANGES.MIN, PRICE_RANGES.MAX],
      sortBy: 'newest'
    });
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));
  };

  const handleAddAllToCart = async () => {
    if (wishlist.length === 0) return;
    
    setIsAddingToCart(true);
    
    try {
      // Add each item to cart with default size and quantity
      wishlist.forEach((item) => {
        const defaultSize = item.sizes[0];
        addToCart(item, 1, defaultSize);
      });
      
      // Show success message
      toast({
        title: "Items Added to Cart!",
        description: `Successfully added ${wishlist.length} item${wishlist.length > 1 ? 's' : ''} from your wishlist to cart.`,
        variant: "default",
      });
      
      // Clear the wishlist after successful addition
      clearWishlist();
      
    } catch (error) {
      // Show error message if something goes wrong
      toast({
        title: "Error",
        description: "Failed to add items to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  const handleAddToCart = (product: Product) => {
    const defaultSize = product.sizes[0];
    addToCart(product, 1, defaultSize);
    
    // Show success message for individual item
    toast({
      title: "Item Added to Cart!",
      description: `${product.title} has been added to your cart.`,
      variant: "default",
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">
              My Wishlist
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Save your favorite items and never lose track of what you love
            </p>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding items you love to your wishlist
              </p>
              <Button
                size="lg"
                className="fill-button bg-gray-900 text-white hover:bg-gray-800 px-8 py-3"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <SheetHeader className="p-6 pb-0">
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Filter your wishlist items by category, size, price, and more
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <ProductFilterSidebar
                          filters={filters}
                          onFiltersChange={handleFiltersChange}
                          onClearFilters={clearAllFilters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Sort Dropdown */}
                <Select value={filters.sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Grid with Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Desktop Filters */}
                <div className="hidden lg:block">
                  <div className="sticky top-24">
                    <ProductFilterSidebar
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={clearAllFilters}
                    />
                  </div>
                </div>

                {/* Products */}
                <div className="lg:col-span-3">
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {filteredAndSortedWishlist.length} of {wishlist.length} wishlist items
                  </div>
                  
                  <SimpleProductGrid
                    products={filteredAndSortedWishlist}
                    onAddToCart={handleAddToCart}
                    onClick={handleProductClick}
                    emptyStateMessage="No items match your current filters"
                    columns={3}
                  />
                </div>
              </div>
              
              {/* Wishlist Summary */}
              <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
                <h2 className="text-xl font-playfair font-bold text-gray-900 mb-2">
                  Ready to shop?
                </h2>
                <p className="text-gray-600 mb-6">
                  You have {wishlist.length} item{wishlist.length > 1 ? 's' : ''} in your wishlist
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="fill-button bg-gray-900 text-white hover:bg-gray-800 px-8 py-3"
                    onClick={handleAddAllToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding to Cart...</span>
                      </div>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add All to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-3"
                    onClick={handleContinueShopping}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Modal - Same as All Products */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
