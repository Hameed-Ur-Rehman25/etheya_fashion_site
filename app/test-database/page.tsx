'use client'

import { useState } from 'react'
import { DatabaseService } from '@/lib/database-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface TestResult {
  name: string
  success: boolean
  error?: string
  details?: any
}

export default function TestDatabasePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [overallStatus, setOverallStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const runAllTests = async () => {
    setIsRunning(true)
    setResults([])
    setOverallStatus('idle')

    const testResults: TestResult[] = []

    try {
      // Test 1: Basic Supabase Connection
      console.log('Running basic Supabase test...')
      const basicTest = await DatabaseService.testBasicSupabase()
      testResults.push({
        name: 'Basic Supabase Connection',
        success: basicTest.success,
        error: basicTest.error || undefined,
        details: basicTest
      })

      // Test 2: Database Connection
      console.log('Running database connection test...')
      const connectionTest = await DatabaseService.testConnection()
      testResults.push({
        name: 'Database Connection',
        success: connectionTest.success,
        error: connectionTest.error?.message,
        details: connectionTest
      })

      // Test 3: Table Existence
      console.log('Running table existence test...')
      const tableTest = await DatabaseService.testTablesExist()
      const tableExists = typeof tableTest === 'object' && !('error' in tableTest)
      testResults.push({
        name: 'Table Existence Check',
        success: tableExists,
        error: 'error' in tableTest ? String(tableTest.error) : undefined,
        details: tableTest
      })

      // Test 4: Table Structure
      console.log('Running table structure test...')
      const structureTest = await DatabaseService.testTableStructure()
      testResults.push({
        name: 'Table Structure & Permissions',
        success: structureTest.success,
        error: structureTest.error || undefined,
        details: structureTest
      })

      // Test 5: Customer Creation
      console.log('Running customer creation test...')
      const customerTest = await DatabaseService.testCreateCustomer()
      testResults.push({
        name: 'Customer Creation Test',
        success: customerTest.success,
        error: customerTest.error?.message,
        details: customerTest
      })

      // Test 6: Products Fetch
      console.log('Running products fetch test...')
      const productsTest = await DatabaseService.getProducts()
      testResults.push({
        name: 'Products Fetch Test',
        success: !productsTest.error,
        error: productsTest.error?.message,
        details: { count: productsTest.data?.length || 0 }
      })

      // Test 7: Categories Fetch
      console.log('Running categories fetch test...')
      const categoriesTest = await DatabaseService.getCategories()
      testResults.push({
        name: 'Categories Fetch Test',
        success: !categoriesTest.error,
        error: categoriesTest.error?.message,
        details: { count: categoriesTest.data?.length || 0 }
      })

      // Test 8: Order Item Creation
      console.log('Running order item creation test...')
      const orderItemTest = await DatabaseService.testCreateOrderItem()
      testResults.push({
        name: 'Order Item Creation Test',
        success: orderItemTest.success,
        error: orderItemTest.error || undefined,
        details: orderItemTest
      })

    } catch (error) {
      console.error('Unexpected error during testing:', error)
      testResults.push({
        name: 'Unexpected Error',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      })
    }

    setResults(testResults)
    setOverallStatus(testResults.every(r => r.success) ? 'success' : 'error')
    setIsRunning(false)
  }

  const getStatusIcon = (success: boolean) => {
    if (success) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (success: boolean) => {
    if (success) return <Badge variant="default" className="bg-green-500">PASS</Badge>
    return <Badge variant="destructive">FAIL</Badge>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Setup Test</h1>
        <p className="text-muted-foreground">
          This page helps diagnose database connection and setup issues. Run the tests to check if your Supabase database is properly configured.
        </p>
      </div>

      <div className="mb-6">
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="w-full sm:w-auto"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run All Tests'
          )}
        </Button>
      </div>

      {overallStatus !== 'idle' && (
        <Alert className={`mb-6 ${overallStatus === 'success' ? 'border-green-500' : 'border-red-500'}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {overallStatus === 'success' 
              ? 'All tests passed! Your database setup is working correctly.'
              : 'Some tests failed. Please check the results below and fix any issues.'
            }
          </AlertDescription>
        </Alert>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Test Results</h2>
          {results.map((result, index) => (
            <Card key={index} className={result.success ? 'border-green-200' : 'border-red-200'}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.success)}
                    <CardTitle className="text-lg">{result.name}</CardTitle>
                  </div>
                  {getStatusBadge(result.success)}
                </div>
              </CardHeader>
              <CardContent>
                {result.error && (
                  <div className="mb-3">
                    <p className="text-sm text-red-600 font-medium">Error:</p>
                    <p className="text-sm text-red-500">{result.error}</p>
                  </div>
                )}
                {result.details && (
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-2">Details:</p>
                    <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Setup Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Go to your Supabase project dashboard</li>
          <li>Navigate to the SQL Editor</li>
          <li>Copy and paste the contents of <code className="bg-background px-1 rounded">database-setup.sql</code></li>
          <li>Run the SQL script to create all required tables</li>
          <li>Come back here and run the tests to verify everything is working</li>
        </ol>
      </div>
    </div>
  )
}
