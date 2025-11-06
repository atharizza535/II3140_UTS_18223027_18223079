'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function TaskCard({ task }: { task: any }) {
  const [status, setStatus] = useState(task.status)

  async function toggleStatus() {
    const next = status === 'done' ? 'todo' : 'done'
    setStatus(next)
    await supabase.from('tasks').update({ status: next }).eq('id', task.id)
  }

  return (
    <div className="p-4 rounded-xl bg-white shadow hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{task.title}</h3>
        <button
          onClick={toggleStatus}
          className={`text-xs px-2 py-1 rounded ${
            status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
        >
          {status}
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      {task.due_at && (
        <p className="text-xs text-gray-500">Due: {new Date(task.due_at).toLocaleString()}</p>
      )}
    </div>
  )
}
