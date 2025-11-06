'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ReactMarkdown from 'react-markdown'

export default function WikiPage() {
  const [page, setPage] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('wiki_pages').select('*').eq('slug', 'main').single()
      if (data) setPage(data)
    }
    load()
  }, [])

  if (!page) return <p>Loading...</p>

  return (
    <div className="prose max-w-none p-4">
      <h1>{page.title}</h1>
      <ReactMarkdown>{page.content || '*No content yet.*'}</ReactMarkdown>
    </div>
  )
}
