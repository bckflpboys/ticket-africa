'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/contexts/cart';
import { ToastProvider } from '@/contexts/toast';
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <ToastProvider>
          <CartProvider>
            <NextAuthProvider>
              <main className="min-h-screen">
                {children}
              </main>
            </NextAuthProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
