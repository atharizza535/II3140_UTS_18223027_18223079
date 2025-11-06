'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Send magic link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`, // ✅ Ensure redirect target
      },
    })

    setLoading(false)

    if (error) {
      console.error('Login error:', error.message)
      setError(error.message)
    } else {
      setSent(true)
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
          <p className="text-green-600 text-sm">
            ✅ Check your email for the login link!
          </p>
        ) : (
          <>
            <input
              type="email"
              className="border w-full p-2 rounded mb-3"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send link'}
            </button>

            {error && (
              <p className="text-red-500 text-sm mt-2">
                ⚠ {error}
              </p>
            )}
          </>
        )}
      </form>
    </main>
  )
}
