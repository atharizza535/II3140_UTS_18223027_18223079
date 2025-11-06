'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LeaderboardPage() {
  const [rows, setRows] = useState<any[]>([])
  useEffect(() => {
    supabase.from('leaderboard').select('*').then(({ data }) => setRows(data || []))
  }, [])
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Leaderboard</h1>
      <table className="min-w-full border rounded">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{r.full_name}</td>
              <td className="p-2">{r.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
