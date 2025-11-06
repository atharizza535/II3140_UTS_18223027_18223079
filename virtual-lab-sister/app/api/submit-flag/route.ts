import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  const { userId, challengeId, submittedFlag } = await req.json()
  if (!userId || !challengeId || !submittedFlag)
    return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 })

  const { data, error } = await supabase.rpc('submit_flag', {
    uid: userId,
    cid: challengeId,
    submitted: submittedFlag,
  })

  if (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }

  const result = data as { status: string; msg: string }
  const success = result.status === 'ok'
  return NextResponse.json({ success, message: result.msg })
}
