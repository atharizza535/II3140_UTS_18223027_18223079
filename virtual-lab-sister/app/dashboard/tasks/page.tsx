'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRealtime } from '@/lib/useRealtime'
import TaskCard from '@/components/TaskCard'
import ErrorDisplay from '@/components/ErrorDisplay'
import SuccessDisplay from '@/components/SuccessDisplay'
import DebugPanel from '@/components/DebugPanel'

interface ErrorState {
  status?: number
  message: string
  details?: any
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorState | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>({})

  async function fetchTasks() {
    try {
      setDebugInfo((prev: any) => ({ ...prev, fetching: true }))
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      setDebugInfo((prev: any) => ({
        ...prev,
        fetching: false,
        fetchResult: { data, error },
        timestamp: new Date().toISOString()
      }))

      if (error) throw error
      setTasks(data || [])
    } catch (err: any) {
      console.error('Error fetching tasks:', err)
      setError({
        status: err.code ? parseInt(err.code) : undefined,
        message: err.message || 'Failed to fetch tasks',
        details: err
      })
    }
  }

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setDebugInfo((prev: any) => ({
        ...prev,
        session: {
          authenticated: !!session,
          userId: session?.user?.id,
          email: session?.user?.email
        }
      }))
    })
    
    fetchTasks()
  }, [])

  useRealtime('tasks', fetchTasks)

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    
    if (!newTitle.trim()) {
      setError({
        status: 400,
        message: 'Task title cannot be empty',
      })
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      setDebugInfo((prev: any) => ({
        ...prev,
        addTask: {
          step: 'auth_check',
          session: !!session,
          sessionError
        }
      }))

      if (sessionError || !session) {
        throw {
          status: 401,
          message: 'You must be logged in to create tasks',
          details: sessionError
        }
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()

      setDebugInfo((prev: any) => ({
        ...prev,
        addTask: {
          ...prev.addTask,
          step: 'get_user',
          user: user?.id,
          userError
        }
      }))

      if (userError || !user) {
        throw {
          status: 401,
          message: 'Could not verify user identity',
          details: userError
        }
      }

      // Attempt to insert
      const taskData = {
        title: newTitle.trim(),
        description: 'New Task',
        status: 'todo',
        created_by: user.id,
      }

      setDebugInfo((prev: any) => ({
        ...prev,
        addTask: {
          ...prev.addTask,
          step: 'inserting',
          taskData
        }
      }))

      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()

      setDebugInfo((prev: any) => ({
        ...prev,
        addTask: {
          ...prev.addTask,
          step: 'insert_complete',
          insertResult: { data, insertError },
          timestamp: new Date().toISOString()
        }
      }))

      if (insertError) {
        // Detailed error based on Supabase error codes
        let status = 500
        let message = insertError.message

        if (insertError.code === '23505') {
          status = 409
          message = 'Duplicate task'
        } else if (insertError.code === '42501') {
          status = 403
          message = 'Permission denied - Check RLS policies'
        } else if (insertError.code === '23503') {
          status = 400
          message = 'Foreign key constraint violation'
        } else if (insertError.code === '42P01') {
          status = 404
          message = 'Table "tasks" does not exist'
        }

        throw {
          status,
          message,
          details: {
            code: insertError.code,
            hint: insertError.hint,
            details: insertError.details,
            original: insertError
          }
        }
      }

      console.log('✅ Task created successfully:', data)
      setSuccess('Task created successfully!')
      setNewTitle('')
      
      // Auto-dismiss success message
      setTimeout(() => setSuccess(null), 3000)
      
      await fetchTasks()
    } catch (err: any) {
      console.error('❌ Error creating task:', err)
      setError({
        status: err.status || 500,
        message: err.message || 'Failed to create task',
        details: err.details || err
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Tasks</h1>
      
      {error && (
        <ErrorDisplay 
          error={error} 
          onDismiss={() => setError(null)} 
        />
      )}

      {success && (
        <SuccessDisplay 
          message={success} 
          onDismiss={() => setSuccess(null)} 
        />
      )}

      <DebugPanel data={debugInfo} label="Debug Information" />

      <form onSubmit={addTask} className="flex gap-2">
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          className="border p-2 flex-1 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Add new task"
          disabled={loading}
        />
        <button 
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Adding...
            </span>
          ) : (
            'Add'
          )}
        </button>
      </form>

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No tasks yet</p>
          <p className="text-sm">Create your first task above</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
      )}
    </div>
  )
}