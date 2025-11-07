'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    console.log('🔐 Login attempt for:', email)

    try {
      // Get the current origin - handle both development and production
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const redirectUrl = `${origin}/auth/callback`

      console.log('📍 Redirect URL:', redirectUrl)
      console.log('📍 Current URL:', window.location.href)

      // Send magic link with explicit redirect
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
          shouldCreateUser: true,
        },
      })

      console.log('📧 OTP Response:', { 
        data, 
        error: error?.message,
        session: data?.session
      })

      setLoading(false)

      if (error) {
        console.error('❌ Login error:', error)
        setError(error.message)
      } else {
        console.log('✅ Magic link sent successfully to:', email)
        setSent(true)
      }
    } catch (err: any) {
      console.error('💥 Unexpected error:', err)
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-lg font-semibold mb-2">Login</h2>
        <p className="text-sm text-gray-600 mb-4">Sign in via magic link</p>

        {sent ? (
          <div className="text-center">
            <div className="text-green-600 text-5xl mb-4">✅</div>
            <p className="text-green-600 text-sm font-medium mb-2">
              Email terkirim!
            </p>
            <p className="text-gray-600 text-xs">
              Cek inbox email Anda untuk link login. Klik link tersebut untuk masuk ke dashboard.
            </p>
          </div>
        ) : (
          <>
            <input
              type="email"
              className="border w-full p-2 rounded mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Mengirim...' : 'Kirim Link Login'}
            </button>

            {error && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-red-600 text-sm">
                  ⚠️ {error}
                </p>
              </div>
            )}
          </>
        )}
      </form>
    </main>
  )
}