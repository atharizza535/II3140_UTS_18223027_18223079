import { supabase } from '@/lib/supabaseClient'

// 🔹 REQUIRED for static export (fixes your Netlify build)
export async function generateStaticParams() {
  const { data } = await supabase.from('wiki_pages').select('slug')
  if (!data) return []
  return data.map((page) => ({ slug: page.slug }))
}

// 🔹 Page renderer
export default async function WikiSlugPage({ params }: { params: { slug: string } }) {
  const { data } = await supabase
    .from('wiki_pages')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">404 - Wiki Page Not Found</h1>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <div className="prose whitespace-pre-wrap">{data.content}</div>
    </div>
  )
}
