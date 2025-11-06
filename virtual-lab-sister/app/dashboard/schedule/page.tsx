'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SchedulePage() {
  const [events, setEvents] = useState<any[]>([])
  useEffect(() => {
    supabase.from('tasks').select('title,due_at,status').then(({ data }) => setEvents(data || []))
  }, [])

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Schedule</h1>
      <div className="space-y-2">
        {events.map(e => (
          <div key={e.title} className="bg-white p-3 rounded shadow flex justify-between">
            <span>{e.title}</span>
            <span className="text-sm text-gray-600">
              {e.due_at ? new Date(e.due_at).toLocaleDateString() : '—'}
            </span>
          </div>
        ))}
      </div>
    </main>
  )
}
