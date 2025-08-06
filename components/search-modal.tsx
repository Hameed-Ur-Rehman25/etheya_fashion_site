'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Image from 'next/image'

const searchResults = [
  { id: 1, title: 'Embroidered Lawn Suit', price: 'Rs. 7,560', image: '/placeholder.svg?height=100&width=100' },
  { id: 2, title: 'Silk Formal Dress', price: 'Rs. 12,500', image: '/placeholder.svg?height=100&width=100' },
  { id: 3, title: 'Cotton Kurta Set', price: 'Rs. 4,200', image: '/placeholder.svg?height=100&width=100' },
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredResults, setFilteredResults] = useState(searchResults)

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResults([])
    } else {
      const filtered = searchResults.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredResults(filtered)
    }
  }, [searchQuery])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 top-20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-playfair font-bold">Search Products</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
              autoFocus
            />
          </div>
          
          {filteredResults.length > 0 && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredResults.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={60}
                    height={60}
                    className="object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {searchQuery && filteredResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found for "{searchQuery}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
