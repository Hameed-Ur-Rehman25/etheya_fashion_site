'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCurrentAdmin, adminLogout, AdminUser } from '@/lib/admin-auth'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  Image, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
}

const adminRoutes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    color: 'text-sky-500'
  },
  {
    label: 'Products',
    icon: Package,
    href: '/admin/products',
    color: 'text-violet-500'
  },
  {
    label: 'Categories',
    icon: FolderOpen,
    href: '/admin/categories',
    color: 'text-pink-500'
  },
  {
    label: 'Hero Section',
    icon: Image,
    href: '/admin/hero',
    color: 'text-orange-500'
  },
  {
    label: 'Admin Users',
    icon: Users,
    href: '/admin/users',
    color: 'text-emerald-500'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings',
    color: 'text-gray-500'
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    // Skip authentication check for login page
    if (pathname === '/admin/login') {
      setLoading(false)
      return
    }

    try {
      const admin = await getCurrentAdmin()
      if (!admin) {
        router.push('/admin/login')
        return
      }
      setAdminUser(admin)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await adminLogout()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    )
  }

  // Show login page without admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!adminUser) {
    return null
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center">
            <span className="text-2xl font-bold text-gray-800">Etheya Admin</span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-6 py-6">
          <div className="space-y-2">
            {adminRoutes.map((route) => {
              const Icon = route.icon
              const isActive = pathname === route.href || (route.href !== '/admin' && pathname.startsWith(route.href))
              
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-gray-100 text-gray-900" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={cn("w-5 h-5 mr-3", route.color)} />
                  {route.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="px-6 py-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {adminUser.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{adminUser.email}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-semibold text-gray-800">Admin Panel</span>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
