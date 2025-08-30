'use client'

import { useEffect, useState } from 'react'
import { getAdminUsers, createAdminUser, deleteAdminUser, AdminUser } from '@/lib/admin-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Trash2, 
  Users,
  Shield,
  Mail
} from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', password: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const adminUsers = await getAdminUsers()
      setUsers(adminUsers)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newUser.email || !newUser.password) {
      setError('Please fill in all fields')
      return
    }

    if (newUser.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setCreating(true)
    setError('')

    try {
      await createAdminUser(newUser.email, newUser.password)
      await loadUsers()
      setDialogOpen(false)
      setNewUser({ email: '', password: '' })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete admin user ${email}? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteAdminUser(userId)
      await loadUsers()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-600 mt-2">Manage administrator accounts and permissions</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Admin User</DialogTitle>
              <DialogDescription>
                Add a new administrator account to the system
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@etheya.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    setNewUser({ email: '', password: '' })
                    setError('')
                  }}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Users List */}
      <div className="grid gap-4">
        {users.length > 0 ? (
          users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.email}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(user.created_at)}
                      </p>
                      {user.updated_at !== user.created_at && (
                        <p className="text-sm text-gray-500">
                          Updated: {formatDate(user.updated_at)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Administrator
                      </span>
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      disabled={users.length === 1}
                      title={users.length === 1 ? "Cannot delete the last admin user" : "Delete admin user"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No admin users</h3>
              <p className="text-gray-500 mb-4">There are no administrator accounts in the system</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Admin
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-xs text-gray-500">Your current session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Security Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">High</div>
            <p className="text-xs text-gray-500">RLS enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle>Security Information</CardTitle>
          <CardDescription>
            Important security considerations for admin users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Row Level Security:</span> All database operations are protected by RLS policies
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium">Email Verification:</span> All admin accounts are automatically verified
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Users className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <span className="font-medium">Minimum Admins:</span> At least one admin user must exist at all times
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
