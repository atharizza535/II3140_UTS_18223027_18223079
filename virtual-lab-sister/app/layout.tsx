// app/layout.tsx
'use client' // Tambahkan ini di baris paling atas

import { useState } from 'react' // Impor useState
import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SplashScreen from '@/components/SplashScreen' // Impor splash screen

const inter = Inter({ subsets: ['latin'] })

// Hapus 'export const metadata' jika menggunakan 'use client'
// Atau pisahkan ke file template.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        {isLoading ? (
          <SplashScreen onFinish={() => setIsLoading(false)} />
        ) : (
          children // Tampilkan konten utama setelah splash selesai
        )}
      </body>
    </html>
  )
}