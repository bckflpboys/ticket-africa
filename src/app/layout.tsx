'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/contexts/cart';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <CartProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
