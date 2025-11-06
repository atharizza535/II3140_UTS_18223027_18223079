import { supabase } from '@/lib/supabaseClient'

// ✅ Tell Next which pages to statically export
export async function generateStaticParams() {
  const { data } = await supabase.from('wiki_pages').select('slug')
  return (data || []).map((page) => ({ slug: page.slug }))
}

// ✅ Normal page component
export default async function WikiSlugPage({ params }: { params: { slug: string } }) {
  const { data } = await supabase
    .from('wiki_pages')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">404 - Page Not Found</h1>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <div className="mt-4 whitespace-pre-wrap">{data.content}</div>
    </div>
  )
}
