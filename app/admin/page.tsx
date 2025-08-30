'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  FolderOpen, 
  Image, 
  Users, 
  TrendingUp, 
  Eye,
  Plus,
  Edit
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalHeroImages: number
  totalAdmins: number
  featuredProducts: number
  outOfStock: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalHeroImages: 0,
    totalAdmins: 0,
    featuredProducts: 0,
    outOfStock: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const [recentCategories, setRecentCategories] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load stats
      const [
        { count: totalProducts },
        { count: totalCategories },
        { count: totalHeroImages },
        { count: totalAdmins },
        { count: featuredProducts },
        { count: outOfStock }
      ] = await Promise.all([
        supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('hero_images').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('admin_users').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('featured', true),
        supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', false)
      ])

      setStats({
        totalProducts: totalProducts || 0,
        totalCategories: totalCategories || 0,
        totalHeroImages: totalHeroImages || 0,
        totalAdmins: totalAdmins || 0,
        featuredProducts: featuredProducts || 0,
        outOfStock: outOfStock || 0
      })

      // Load recent products
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentProducts(products || [])

      // Load recent categories
      const { data: categories } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentCategories(categories || [])

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      description: `${stats.featuredProducts} featured`,
      icon: Package,
      color: 'text-blue-600',
      href: '/admin/products'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      description: 'Product categories',
      icon: FolderOpen,
      color: 'text-green-600',
      href: '/admin/categories'
    },
    {
      title: 'Hero Images',
      value: stats.totalHeroImages,
      description: 'Homepage slides',
      icon: Image,
      color: 'text-purple-600',
      href: '/admin/hero'
    },
    {
      title: 'Admin Users',
      value: stats.totalAdmins,
      description: 'System administrators',
      icon: Users,
      color: 'text-orange-600',
      href: '/admin/users'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the Etheya Fashion Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-gray-600 mt-1">{card.description}</p>
                <Link href={card.href}>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Manage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/products/new">
              <Button className="w-full" variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Link href="/admin/categories/new">
              <Button className="w-full" variant="outline">
                <FolderOpen className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </Link>
            <Link href="/admin/hero/new">
              <Button className="w-full" variant="outline">
                <Image className="w-4 h-4 mr-2" />
                Add Hero Image
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Products</span>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{product.title}</p>
                        <p className="text-xs text-gray-500">{product.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {product.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                      {!product.in_stock && (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No products found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Categories</span>
              <Link href="/admin/categories">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCategories.length > 0 ? (
                recentCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">{category.title}</p>
                        <p className="text-xs text-gray-500">{category.product_count} products</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {category.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No categories found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      {stats.outOfStock > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Attention Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700">
              You have {stats.outOfStock} products that are out of stock. 
              <Link href="/admin/products?filter=out-of-stock" className="ml-2 underline">
                View and update them →
              </Link>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
