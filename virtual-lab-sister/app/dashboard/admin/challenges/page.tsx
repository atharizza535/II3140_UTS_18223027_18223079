'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ChallengeAnalytics() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.rpc('challenge_stats')
      setRows(data || [])
    }
    load()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Challenge Stats</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Challenge</th>
            <th className="p-2">Attempts</th>
            <th className="p-2">Solves</th>
            <th className="p-2">Success Rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.title}</td>
              <td className="p-2">{r.attempts}</td>
              <td className="p-2">{r.solves}</td>
              <td className="p-2">
                {r.attempts > 0 ? ((r.solves / r.attempts) * 100).toFixed(1) + '%' : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
