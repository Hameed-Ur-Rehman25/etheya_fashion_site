'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, Heart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchModal } from './search-modal'
import { CartDrawer } from './cart-drawer'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-playfair font-bold text-gray-900">Aura</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors">
                All Products
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-gray-900 transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-gray-900"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="text-gray-700 hover:text-gray-900 relative"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-700 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Home
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors">
                  All Products
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Categories
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
