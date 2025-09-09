import type { Metadata } from 'next'
import { Inter, Playfair_Display, Happy_Monkey } from 'next/font/google'
import { APP_CONFIG } from '@/shared/constants/app.constants'
import './globals.css'
import { WishlistProvider } from '../context/WishlistContext'
import { CartProvider } from '../context/CartContext'
import { BuyNowProvider } from '../context/BuyNowContext'
import { ProductCacheProvider } from '../context/ProductCacheContext'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const happyMonkey = Happy_Monkey({ 
  weight: '400',
  subsets: ['latin'], 
  variable: '--font-happy-monkey' 
})

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  generator: 'Next.js'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${happyMonkey.variable} font-sans antialiased`}>
        <ProductCacheProvider>
          <WishlistProvider>
            <CartProvider>
              <BuyNowProvider>
                {children}
                <Toaster />
              </BuyNowProvider>
            </CartProvider>
          </WishlistProvider>
        </ProductCacheProvider>
      </body>
    </html>
  )
}
