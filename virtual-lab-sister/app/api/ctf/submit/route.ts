import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  const { id, flag } = await req.json()
  const hash = createHash('sha256').update(flag.trim()).digest('hex')

  const { data: chall } = await supabase.from('ctf_challenges').select('*').eq('id', id).single()
  if (!chall) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })

  const correct = chall.flag_hash === hash
  const {
    data: { user },
  } = await supabase.auth.getUser()

  await supabase.from('ctf_submissions').insert({
    user_id: user?.id,
    challenge_id: id,
    submitted_flag: flag,
    correct,
  })

  return NextResponse.json({ correct })
}
