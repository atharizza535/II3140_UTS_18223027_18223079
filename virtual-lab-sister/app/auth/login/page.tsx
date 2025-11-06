'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const router = useRouter()

  async function signInWithEmail() {
    setStatus('Sending magic link...')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
      setStatus(`Error: ${error.message}`)
    } else {
      setStatus('Check your email for the login link!')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border rounded px-3 py-2 w-64"
      />

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={signInWithEmail}
      >
        Send Magic Link
      </button>

      {status && <p className="text-sm mt-2">{status}</p>}
    </div>
  )
}
