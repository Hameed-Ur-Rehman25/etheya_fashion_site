'use client'

import { useState } from 'react'
import Image from 'next/image'
import { User, Package, MapPin, Heart, LogOut, Edit } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Navbar } from '@/shared/components/layout/navbar'

const tabs = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('orders')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-playfair font-bold">My Orders</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div key={order} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Order #AUR{order}001</h3>
                      <p className="text-sm text-gray-600">Placed on March {order + 10}, 2024</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Delivered
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Product"
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium">Embroidered Lawn Suit</h4>
                      <p className="text-gray-600">Size: M</p>
                      <p className="font-bold">Rs. 7,560</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-playfair font-bold">Addresses</h2>
              <Button className="fill-button bg-gray-900 text-white hover:bg-gray-800">
                Add New Address
              </Button>
            </div>
            <div className="grid gap-4">
              {[1, 2].map((address) => (
                <div key={address} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium mb-2">Home</h3>
                      <p className="text-gray-600">
                        123 Main Street, Block A<br />
                        Lahore, Punjab 54000<br />
                        Pakistan
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'wishlist':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-playfair font-bold">Wishlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white rounded-lg overflow-hidden border">
                  <div className="relative overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=250"
                      alt="Wishlist item"
                      width={250}
                      height={300}
                      className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-500"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">Embroidered Lawn Suit</h3>
                    <p className="text-lg font-bold mb-3">Rs. 7,560</p>
                    <Button className="w-full fill-button bg-gray-900 text-white hover:bg-gray-800">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                {/* Profile Header */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt="Profile"
                      width={100}
                      height={100}
                      className="rounded-full object-cover"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-playfair font-bold mt-4">Sarah Ahmed</h2>
                  <p className="text-gray-600">sarah.ahmed@email.com</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
