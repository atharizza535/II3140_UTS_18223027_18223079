// virtual-lab-sister/app/api/tasks/create/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Destructure all new fields from the body
    const { 
      title, 
      description, 
      due_at, 
      status, 
      course, 
      assignee, 
      priority 
    } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Insert task with all new fields
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: title.trim(),
        description: description?.trim() || '',
        due_at: due_at || null,
        status: status || 'todo',
        created_by: user.id,
        // Add new fields to the insert object
        course: course || null,
        assignee: assignee || null,
        priority: priority || 'Medium', // Default to 'Medium' as in modal
      })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json(
        { error: 'Failed to create task', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}