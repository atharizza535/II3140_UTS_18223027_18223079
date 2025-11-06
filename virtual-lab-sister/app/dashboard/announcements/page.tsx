'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ReactMarkdown from 'react-markdown'

export default function AnnouncementsPage() {
  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', content: '', tag: '' })

  const load = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    setList(data || [])
  }
  useEffect(() => { load() }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('announcements').insert(form)
    setForm({ title: '', content: '', tag: '' })
    load()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="space-y-2">
        <input className="border p-2 w-full rounded" placeholder="Title"
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="border p-2 w-full rounded" placeholder="Tag (optional)"
          value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
        <textarea className="border p-2 w-full rounded h-28" placeholder="Markdown content"
          value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Post</button>
      </form>

      {list.map(a => (
        <div key={a.id} className="bg-white shadow p-3 rounded">
          <h3 className="font-semibold">{a.title}</h3>
          {a.tag && <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">{a.tag}</span>}
            <div className="prose">
            <ReactMarkdown>{a.content}</ReactMarkdown>
            </div>
          <p className="text-xs text-gray-400">{new Date(a.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
