'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPage() {
  const [stats, setStats] = useState({ users: 0, tasks: 0, labs: 0 })

  useEffect(() => {
    const load = async () => {
      const [u, t, l] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact' }),
        supabase.from('tasks').select('*', { count: 'exact' }),
        supabase.from('leaderboard').select('*', { count: 'exact' }),
      ])
      setStats({
        users: u.count || 0,
        tasks: t.count || 0,
        labs: l.count || 0,
      })
    }
    load()
  }, [])

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {Object.entries(stats).map(([k, v]) => (
        <div key={k} className="p-6 bg-white rounded shadow text-center">
          <h3 className="text-gray-500 text-sm uppercase">{k}</h3>
          <p className="text-2xl font-bold">{v}</p>
        </div>
      ))}
    </div>
  )
}
