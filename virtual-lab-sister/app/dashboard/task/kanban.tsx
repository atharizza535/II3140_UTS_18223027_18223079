'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRealtime } from '@/lib/useRealtime'

const STATUSES = ['todo', 'in_progress', 'done']

export default function Kanban() {
  const [tasks, setTasks] = useState<any[]>([])

  async function load() {
    const { data } = await supabase.from('tasks').select('*')
    setTasks(data || [])
  }
  useEffect(() => { load() }, [])
  useRealtime('tasks', load)

  async function moveTask(id: string, status: string) {
    await supabase.from('tasks').update({ status }).eq('id', id)
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {STATUSES.map(status => (
        <div key={status} className="bg-gray-50 rounded-lg p-3 border">
          <h3 className="font-semibold capitalize mb-2">{status.replace('_', ' ')}</h3>
          <div className="space-y-2 min-h-[200px]">
            {tasks
              .filter(t => t.status === status)
              .map(t => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('id', t.id)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    moveTask(e.dataTransfer.getData('id'), status)
                  }}
                  className="bg-white p-3 rounded shadow cursor-move"
                >
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-gray-500">{t.description}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
