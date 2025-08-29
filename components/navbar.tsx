'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
                <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors font-happy-monkey text-base">
                  About
                </Link>
                <a
                  href="#footer"
                  className="text-gray-700 hover:text-gray-900 transition-colors font-happy-monkey text-base"
                  onClick={e => {
                    e.preventDefault();
                    const footer = document.getElementById('footer');
                    if (footer) {
                      footer.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Contact
                </a>
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

            {/* Right Icons */}
            <div className="flex space-x-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-gray-900 hover:bg-transparent"
              >
                <div className="transition-transform hover:scale-110">
                  <Search className="w-6 h-6" />
                </div>
              </Button>
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900 hover:bg-transparent">
                  <div className="transition-transform hover:scale-110">
                    <Heart className="w-6 h-6" />
                  </div>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsCartOpen(true)}
                className="bg-transparent border-black text-black hover:bg-black hover:text-white rounded-full px-4 py-2 h-auto flex items-center gap-2 transition-all"
              >
                <span className="font-medium font-happy-monkey">My Cart</span>
                <ShoppingBag className="w-5 h-5" />
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

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
