'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useAuth from '@/lib/useAuth'

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) router.push('/auth/login')
  }, [user])

  if (!user) return <p className="p-6">Loading...</p>
  return <>{children}</>
}
