import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Aura - Modern South Asian Fashion',
  description: 'Elegant women\'s clothing collection featuring T-shirts, stitched & unstitched suits',
  keywords: ['fashion', 'south asian', 'clothing', 'women', 'suits', 'formal wear'],
  authors: [{ name: 'Etheya Fashion' }],
  creator: 'Etheya Fashion',
  publisher: 'Etheya Fashion',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Aura - Modern South Asian Fashion',
    description: 'Elegant women\'s clothing collection featuring T-shirts, stitched & unstitched suits',
    type: 'website',
    locale: 'en_US',
    siteName: 'Aura Fashion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura - Modern South Asian Fashion',
    description: 'Elegant women\'s clothing collection featuring T-shirts, stitched & unstitched suits',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
