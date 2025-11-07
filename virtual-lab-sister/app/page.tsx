// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center space-y-6 p-4">
      
      {/* --- KOTAK BIRU-UNGU SEBAGAI LATAR BELAKANG LOGO --- */}
      <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl">
        <Image
          src="/applogo.png" // Logo Anda
          alt="App Logo"
          width={300} // Sesuaikan lebar (width) logo Anda
          height={80} // Sesuaikan tinggi (height) logo Anda
          priority
          className="rounded-md" // Menambahkan sedikit lengkungan jika logo Anda punya background putih
        />
      </div>
      {/* --- BATAS KOTAK --- */}

      <h1 className="text-4xl font-bold">Virtual Lab Sistem Terdistribusi</h1>
      <p className="text-gray-600">
        A unified assistant platform for tasks and challenges.
      </p>
      <div className="space-x-4">
        <Link
          href="/auth/login"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Login
        </Link>
      </div>
    </main>
  )
}