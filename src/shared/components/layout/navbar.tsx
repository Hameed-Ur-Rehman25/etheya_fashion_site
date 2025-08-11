'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, Heart, Menu, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/utils/cn'

interface NavbarProps {
  cartItemCount?: number
  wishlistItemCount?: number
  onSearchToggle?: () => void
  onCartToggle?: () => void
  onWishlistClick?: () => void
  className?: string
}

export function Navbar({
  cartItemCount = 0,
  wishlistItemCount = 0,
  onSearchToggle,
  onCartToggle,
  onWishlistClick,
  className
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={cn(
      `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`,
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Menu Button (Mobile only) or Desktop Navigation Links */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-gray-900 hover:bg-transparent"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="transition-transform hover:scale-110">
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </div>
              </Button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors font-happy-monkey text-base">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors font-happy-monkey text-base">
                All Products
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors font-happy-monkey text-base">
                Contact
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors font-happy-monkey text-base">
                About us
              </Link>
            </div>
          </div>

          {/* Center - Logo */}
          <Link href="/" className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
            <div className="relative w-8 h-8">
              <Image
                src="/assets/logo.png"
                alt="Etheya Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-happy-monkey text-gray-900">Etheya</span>
          </Link>

          {/* Right - Search, Cart, Profile Icons */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onSearchToggle}
              className="text-gray-700 hover:text-gray-900 hover:bg-transparent"
            >
              <div className="transition-transform hover:scale-110">
                <Search className="w-6 h-6" />
              </div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onWishlistClick}
              className="text-gray-700 hover:text-gray-900 hover:bg-transparent relative"
            >
              <div className="transition-transform hover:scale-110">
                <Heart className="w-6 h-6" />
                {wishlistItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                  </Badge>
                )}
              </div>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onCartToggle}
              className="text-gray-700 hover:text-gray-900 hover:bg-transparent relative"
            >
              <div className="transition-transform hover:scale-110">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Badge>
                )}
              </div>
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900 hover:bg-transparent">
                <div className="transition-transform hover:scale-110">
                  <User className="w-6 h-6" />
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu - Only visible on mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <div className="flex flex-col space-y-4 px-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-gray-900 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
