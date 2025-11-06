'use client'
import { useEffect } from 'react'
import { supabase } from './supabaseClient'

export function useRealtime(table: string, onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, onChange)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}
