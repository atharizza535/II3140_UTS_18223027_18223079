// app/api/tasks/submit/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    // Parse the multipart form data
    const formData = await req.formData()
    const taskId = formData.get('taskId') as string
    const file = formData.get('file') as File | null

    console.log('📝 Submit Task - Received:', { taskId, hasFile: !!file, fileName: file?.name })

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // Create server-side Supabase client (uses cookies automatically)
    const supabase = await createServerSupabaseClient()

    // 1. Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('🔐 Auth check:', { 
      hasUser: !!user, 
      userId: user?.id,
      email: user?.email,
      authError: authError?.message 
    })

    if (authError || !user) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized - Please login again' },
        { status: 401 }
      )
    }

    // 2. Upload file to Supabase Storage
    const fileName = `${user.id}/${Date.now()}_${file.name}`
    
    console.log('📤 Uploading file:', fileName)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('task-files')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      )
    }

    console.log('✅ File uploaded:', uploadData.path)

    // 3. Update the task in database (server-side bypasses RLS)
    const { data: taskData, error: updateError } = await supabase
      .from('tasks')
      .update({
        status: 'done',
        file_url: uploadData.path
      })
      .eq('id', taskId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Task update error:', updateError)
      
      // Clean up uploaded file if task update fails
      await supabase.storage.from('task-files').remove([fileName])
      
      if (updateError.code === '42501') {
        return NextResponse.json(
          { error: 'Permission denied to update task' },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to update task', details: updateError.message },
        { status: 500 }
      )
    }

    console.log('✅ Task updated successfully:', taskData.id)

    return NextResponse.json({ 
      success: true, 
      data: taskData,
      fileUrl: uploadData.path
    })

  } catch (err: any) {
    console.error('💥 Unexpected error:', err)
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    )
  }
}