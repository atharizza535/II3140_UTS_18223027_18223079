'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ReactMarkdown from 'react-markdown'
import ErrorDisplay from '@/components/ErrorDisplay'
import SuccessDisplay from '@/components/SuccessDisplay'
import DebugPanel from '@/components/DebugPanel'

interface ErrorState {
  status?: number
  message: string
  details?: any
}

export default function AnnouncementsPage() {
  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', content: '', tag: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorState | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>({})

  const load = async () => {
    try {
      setDebugInfo((prev: any) => ({ ...prev, loading: true }))
      
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

      setDebugInfo((prev: any) => ({
        ...prev,
        loading: false,
        loadResult: { data, error },
        timestamp: new Date().toISOString()
      }))

      if (error) throw error
      setList(data || [])
    } catch (err: any) {
      console.error('Error loading announcements:', err)
      setError({
        status: err.code ? parseInt(err.code) : undefined,
        message: err.message || 'Failed to load announcements',
        details: err
      })
    }
  }

  useEffect(() => {
    // Check auth
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

    load()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!form.title.trim() || !form.content.trim()) {
      setError({
        status: 400,
        message: 'Title and content are required'
      })
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      setDebugInfo((prev: any) => ({
        ...prev,
        submit: {
          step: 'auth_check',
          session: !!session,
          sessionError
        }
      }))

      if (sessionError || !session) {
        throw {
          status: 401,
          message: 'You must be logged in to create announcements',
          details: sessionError
        }
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()

      setDebugInfo((prev: any) => ({
        ...prev,
        submit: {
          ...prev.submit,
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

      const announcementData = {
        title: form.title.trim(),
        content: form.content.trim(),
        tag: form.tag.trim() || null,
        created_by: user.id,
      }

      setDebugInfo((prev: any) => ({
        ...prev,
        submit: {
          ...prev.submit,
          step: 'inserting',
          announcementData
        }
      }))

      const { data, error: insertError } = await supabase
        .from('announcements')
        .insert(announcementData)
        .select()

      setDebugInfo((prev: any) => ({
        ...prev,
        submit: {
          ...prev.submit,
          step: 'insert_complete',
          insertResult: { data, insertError },
          timestamp: new Date().toISOString()
        }
      }))

      if (insertError) {
        let status = 500
        let message = insertError.message

        if (insertError.code === '42501') {
          status = 403
          message = 'Permission denied - Check RLS policies'
        } else if (insertError.code === '42P01') {
          status = 404
          message = 'Table "announcements" does not exist'
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

      console.log('✅ Announcement created successfully:', data)
      setSuccess('Announcement created successfully!')
      setForm({ title: '', content: '', tag: '' })
      
      setTimeout(() => setSuccess(null), 3000)
      
      await load()
    } catch (err: any) {
      console.error('❌ Error creating announcement:', err)
      setError({
        status: err.status || 500,
        message: err.message || 'Failed to create announcement',
        details: err.details || err
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Announcements</h1>

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

      <form onSubmit={submit} className="space-y-2 bg-white p-4 rounded shadow">
        <input
          className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-500"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          disabled={loading}
          required
        />
        <input
          className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-500"
          placeholder="Tag (optional)"
          value={form.tag}
          onChange={e => setForm({ ...form, tag: e.target.value })}
          disabled={loading}
        />
        <textarea
          className="border p-2 w-full rounded h-28 focus:ring-2 focus:ring-indigo-500"
          placeholder="Markdown content"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
          disabled={loading}
          required
        />
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition"
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Posting...
            </span>
          ) : (
            'Post'
          )}
        </button>
      </form>

      {list.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No announcements yet</p>
          <p className="text-sm">Create your first announcement above</p>
        </div>
      ) : (
        list.map(a => (
          <div key={a.id} className="bg-white shadow p-4 rounded">
            <h3 className="font-semibold text-lg">{a.title}</h3>
            {a.tag && (
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded inline-block mt-1">
                {a.tag}
              </span>
            )}
            <div className="prose mt-2 max-w-none">
              <ReactMarkdown>{a.content}</ReactMarkdown>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(a.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  )
}