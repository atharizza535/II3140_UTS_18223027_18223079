'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CTFPage() {
  const [challenges, setChallenges] = useState<any[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('challenges').select('*')
      setChallenges(data || [])
    }
    load()
  }, [])

  async function submitFlag(challengeId: string) {
    const user = (await supabase.auth.getUser()).data.user
    const res = await fetch('/api/submit-flag', {
      method: 'POST',
      body: JSON.stringify({ userId: user?.id, challengeId, submittedFlag: input }),
    })
    const json = await res.json()
    alert(json.message)
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">CTF Challenges</h1>
      {challenges.map((c) => (
        <div key={c.id} className="border p-4 mb-4 rounded bg-white shadow">
          <h3 className="font-semibold">{c.title}</h3>
          <p className="text-sm text-gray-600">{c.description}</p>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-1 rounded mt-2 w-1/2"
            placeholder="Enter flag..."
          />
          <button
            onClick={() => submitFlag(c.id)}
            className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
          >
            Submit
          </button>
        </div>
      ))}
    </div>
  )
}
