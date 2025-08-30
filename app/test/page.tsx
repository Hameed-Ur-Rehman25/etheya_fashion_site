'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState('Loading...')
  const [error, setError] = useState('')

  useEffect(() => {
    async function testSupabase() {
      try {
        setStatus('Testing Supabase connection...')
        
        // Test basic connection
        const { data, error } = await supabase.from('admin_users').select('count').limit(1)
        
        if (error) {
          setError(`Supabase error: ${error.message}`)
          setStatus('Failed')
        } else {
          setStatus('Supabase connection successful!')
        }
      } catch (err: any) {
        setError(`Exception: ${err.message}`)
        setStatus('Failed')
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Test</h1>
      <div className="mb-4">
        <strong>Status:</strong> {status}
      </div>
      {error && (
        <div className="text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
