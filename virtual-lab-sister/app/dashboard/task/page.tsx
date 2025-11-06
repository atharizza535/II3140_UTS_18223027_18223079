'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRealtime } from '@/lib/useRealtime'
import TaskCard from '@/components/TaskCard'

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [newTitle, setNewTitle] = useState('')

  async function fetchTasks() {
    const { data } = await supabase.from('tasks').select('*').order('due_at', { ascending: true })
    setTasks(data || [])
  }

  useEffect(() => {
  // define async fn inside the effect
  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*')
    setTasks(data || [])
  }
  fetchTasks()
}, [])

  useRealtime('tasks', fetchTasks)

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle) return
    await supabase.from('tasks').insert({ title: newTitle, description: 'New Task' })
    setNewTitle('')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Tasks</h1>
      <form onSubmit={addTask} className="flex gap-2">
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Add new task"
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map(task => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  )
}
