'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function NotificationsPage() {
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false })
      setList(data || [])
    }
    load()
  }, [])
  async function markRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setList(list.filter(l => l.id !== id))
  }
  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Notifications</h1>
      {list.map(n => (
        <div key={n.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
          <p>{n.message}</p>
          <button onClick={() => markRead(n.id)} className="text-xs text-indigo-600 underline">
            Mark read
          </button>
        </div>
      ))}
    </div>
  )
}
