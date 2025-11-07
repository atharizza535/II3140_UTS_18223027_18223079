'use client'
import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'

const priorityColors: { [key: string]: string } = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-blue-100 text-blue-700',
}

const formatDate = (dateString: string) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const formatRemainingDays = (dateString: string) => {
  if (!dateString) return null
  const now = new Date()
  const deadline = new Date(dateString)
  const diffTime = deadline.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return <span className="text-red-600">Terlambat {Math.abs(diffDays)} hari</span>
  }
  if (diffDays === 0) {
    return <span className="text-yellow-600">Hari ini</span>
  }
  return <span>{diffDays} hari lagi</span>
}

export default function KanbanTaskCard({ task, onTaskUpdate }: { task: any, onTaskUpdate: () => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    setError(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    setUploadProgress('Mempersiapkan upload...')

    try {
      console.log('📤 Starting upload for file:', file.name)

      // Get session with access token (SAME AS CTF!)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      console.log('🔍 Session check:', { 
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        sessionError: sessionError?.message,
        taskId: task.id,
        fileName: file.name
      })

      if (sessionError || !session?.access_token) {
        throw new Error('You must be logged in to submit. Please login again.')
      }

      // Create FormData and append file + taskId + accessToken
      const formData = new FormData()
      formData.append('file', file)
      formData.append('taskId', task.id)
      formData.append('accessToken', session.access_token) // PASS TOKEN LIKE CTF!

      setUploadProgress('Mengunggah file...')

      // Send to API endpoint
      const response = await fetch('/api/tasks/submit', {
        method: 'POST',
        body: formData, // FormData automatically sets correct Content-Type
      })

      const data = await response.json()

      console.log('📥 Response:', { status: response.status, data })

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Upload gagal')
      }

      setUploadProgress('Berhasil! Memuat ulang...')
      
      // Success! Refresh the task list
      setTimeout(() => {
        onTaskUpdate()
        setUploadProgress('')
      }, 500)

    } catch (error: any) {
      const msg = error?.message ?? String(error)
      console.error('❌ Upload error:', msg)
      setError(msg)
      setUploadProgress('')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Generate public URL for viewing uploaded file
  const filePublicUrl = task.file_url 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/task-files/${task.file_url}`
    : null

  const title = task.title || 'Tanpa Judul'
  const description = task.description || 'Tidak ada deskripsi.'
  const priority = task.priority || 'Medium'
  const course = task.course || 'Mata Kuliah Umum'
  const assignee = task.assignee || 'Belum di-assign'
  const deadline = formatDate(task.due_at)
  const remainingDays = formatRemainingDays(task.due_at)

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-3">
      {/* Header with title and priority */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            priorityColors[priority] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {priority}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

      {/* Course tag */}
      <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full inline-block">
        {course}
      </span>

      {/* Assignee and deadline */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
        <span className="truncate pr-2">{assignee}</span>
        {deadline && (
          <span className="text-right whitespace-nowrap">{remainingDays}</span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="pt-2">
          <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Upload progress */}
      {uploadProgress && (
        <div className="pt-2">
          <div className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded border border-blue-200">
            {uploadProgress}
          </div>
        </div>
      )}

      {/* Upload button - only shows if status is 'todo' */}
      {task.status === 'todo' && (
        <div className="pt-3 border-t">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
            accept="*/*"
          />
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <span>📎</span>
                <span>Upload File Tugas</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* View file button - only shows if status is 'done' and file exists */}
      {task.status === 'done' && filePublicUrl && (
        <div className="pt-3 border-t">
          <a
            href={filePublicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center block px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm hover:bg-green-200 transition-colors"
          >
            ✓ Lihat File yang Diupload
          </a>
        </div>
      )}

      {/* Status indicator for done tasks without file */}
      {task.status === 'done' && !filePublicUrl && (
        <div className="pt-3 border-t">
          <div className="text-center text-xs text-green-700 bg-green-50 px-3 py-2 rounded">
            ✓ Tugas selesai (tidak ada file)
          </div>
        </div>
      )}
    </div>
  )
}