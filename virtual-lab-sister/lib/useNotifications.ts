'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function useNotifications(userId?: string) {
  const [notes, setNotes] = useState<any[]>([])

  useEffect(() => {
    if (!userId) return

    // define async fetch inside useEffect
    const load = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
      setNotes(data || [])
    }

    load()

    // subscribe to realtime updates
    const channel = supabase
      .channel('realtime:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        () => {
          load()
        }
      )
      .subscribe()

    // cleanup (do not return a Promise)
    return () => {
      supabase.removeChannel(channel) // call, don't await
    }
  }, [userId])

  return notes
}
