// components/SplashScreen.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// Tahapan splash screen
// 1. 'loading': Menampilkan teks "Loading..."
// 2. 'logo': Menampilkan logo
// 3. 'finished': Selesai, siap untuk transisi keluar
type SplashStage = 'loading' | 'logo' | 'finished'

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [stage, setStage] = useState<SplashStage>('loading')
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Stage 1: 'loading' (1.5 detik)
    const timerLoading = setTimeout(() => {
      setStage('logo')
    }, 1500) // Durasi "Loading..."

    // Stage 2: 'logo' (2 detik)
    const timerLogo = setTimeout(() => {
      setStage('finished')
      setIsFadingOut(true) // Mulai transisi fade-out
    }, 3500) // Total waktu = 1.5s + 2s

    // Stage 3: 'finished' (0.5 detik transisi)
    const timerFinish = setTimeout(() => {
      onFinish() // Panggil onFinish setelah animasi fade-out
    }, 4000) // Total waktu = 1.5s + 2s + 0.5s

    // Cleanup timers jika komponen unmount
    return () => {
      clearTimeout(timerLoading)
      clearTimeout(timerLogo)
      clearTimeout(timerFinish)
    }
  }, [onFinish])

  // Tentukan opacity berdasarkan stage
  const loadingOpacity = stage === 'loading' ? 'opacity-100' : 'opacity-0'
  const logoOpacity = stage === 'logo' || stage === 'finished' ? 'opacity-100' : 'opacity-0'

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-indigo-700 transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Teks Loading */}
      <div
        className={`absolute transition-opacity duration-500 ${loadingOpacity}`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-t-4 border-indigo-200 border-t-white rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>

      {/* Logo */}
      <div
        className={`absolute transition-opacity duration-500 delay-300 ${logoOpacity}`}
      >
        <Image
          src="/applogo.png" // Menggunakan logo Anda
          alt="App Logo"
          width={300} // Sesuaikan ukurannya
          height={80}
          priority
        />
      </div>
    </div>
  )
}