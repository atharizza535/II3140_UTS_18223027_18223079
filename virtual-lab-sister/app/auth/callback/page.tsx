'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const finishAuth = async () => {
      console.log('🔐 Auth Callback Started')
      
      try {
        // First, check if there's a hash in the URL (magic link callback)
        const hash = window.location.hash
        console.log('URL hash:', hash)

        // Wait a bit for Supabase to process the hash
        await new Promise(resolve => setTimeout(resolve, 500))

        // Check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        const debug = {
          hasHash: !!hash,
          hasSession: !!session,
          sessionError: sessionError?.message,
          userId: session?.user?.id,
          email: session?.user?.email,
          timestamp: new Date().toISOString()
        }
        
        console.log('Session check:', debug)
        setDebugInfo(debug)

        if (sessionError) {
          console.error('Session error:', sessionError)
          setError(`Session error: ${sessionError.message}`)
          // Wait a bit before redirecting
          await new Promise(resolve => setTimeout(resolve, 2000))
          router.replace('/auth/login')
          return
        }

        if (session && session.user) {
          console.log('✅ Session found, redirecting to dashboard')
          // Use replace to avoid back button issues
          router.replace('/dashboard')
        } else {
          console.log('❌ No session, redirecting to login')
          setError('No session found. Please try logging in again.')
          await new Promise(resolve => setTimeout(resolve, 2000))
          router.replace('/auth/login')
        }
      } catch (err: any) {
        console.error('Auth callback error:', err)
        setError(`Error: ${err.message}`)
        setDebugInfo((prev: any) => ({ ...prev, error: err.message }))
        await new Promise(resolve => setTimeout(resolve, 2000))
        router.replace('/auth/login')
      }
    }
    
    finishAuth()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">Finalizing login...</p>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-left">
            <p className="text-red-600 text-sm font-medium mb-1">⚠️ Error</p>
            <p className="text-red-500 text-xs">{error}</p>
          </div>
        )}

        {/* Debug info - only show in development */}
        {process.env.NODE_ENV === 'development' && Object.keys(debugInfo).length > 0 && (
          <details className="mt-4 text-left">
            <summary className="text-xs text-gray-500 cursor-pointer">Debug Info</summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}