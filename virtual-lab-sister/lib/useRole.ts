'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function useRole() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('users').select('role').eq('email', user.email).single()
        setRole(data?.role || null)
      }
    }
    fetchRole()
  }, [])
  return role
}
