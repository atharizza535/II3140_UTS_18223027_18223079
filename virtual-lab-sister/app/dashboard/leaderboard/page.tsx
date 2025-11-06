'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LeaderboardPage() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('leaderboard')
        .select('score, user_id, users(full_name)')
        .order('score', { ascending: false })
      setData(data || [])
    }
    load()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Leaderboard</h1>
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Rank</th>
            <th className="p-2">Name</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={d.user_id} className="border-t">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{d.users?.full_name || 'Unknown'}</td>
              <td className="p-2">{d.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
