import type { Metadata } from 'next'
import { Inter, Playfair_Display, Happy_Monkey } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const happyMonkey = Happy_Monkey({ 
  weight: '400',
  subsets: ['latin'], 
  variable: '--font-happy-monkey' 
})

export const metadata: Metadata = {
  title: 'Aura - Modern South Asian Fashion',
  description: 'Elegant women\'s clothing collection featuring T-shirts, stitched & unstitched suits',
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${happyMonkey.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
