'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (!error) setSent(true)
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-lg font-semibold mb-2">Login</h2>
        <p className="text-sm text-gray-600 mb-4">Sign in via magic link</p>
        {sent ? (
          <p className="text-green-600 text-sm">Check your email for the login link!</p>
        ) : (
          <>
            <input
              type="email"
              className="border w-full p-2 rounded mb-3"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Send link</button>
          </>
        )}
      </form>
    </main>
  )
}
