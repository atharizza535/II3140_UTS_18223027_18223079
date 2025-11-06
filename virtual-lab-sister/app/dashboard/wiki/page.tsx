'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import WikiEditor from '@/components/WikiEditor'

export default function WikiPage() {
  const [page, setPage] = useState<any>({ title: '', content: '' })

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('wiki_pages').select('*').eq('slug', 'main').single()
      if (data) setPage(data)
    }
    load()
  }, [])

  async function savePage(content: string) {
    await supabase.from('wiki_pages').upsert({
      slug: 'main',
      title: 'Main Wiki',
      content,
    })
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">{page.title || 'Main Wiki'}</h1>
      <WikiEditor initialValue={page.content} onSave={savePage} />
    </div>
  )
}
