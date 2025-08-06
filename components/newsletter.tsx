'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionContainer } from './section-container'
import { useToast } from '@/hooks/use-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Use browser's built-in validation for email input
    if (!e.currentTarget.checkValidity()) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter",
      })
      
      setEmail('')
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SectionContainer background="gray" padding="lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          WHAT ARE YOU WAITING FOR
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about our latest collections, 
          exclusive offers, and fashion updates.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
        </form>
      </div>
    </SectionContainer>
  )
}
