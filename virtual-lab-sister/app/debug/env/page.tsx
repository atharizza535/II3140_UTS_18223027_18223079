// Create this file: app/debug/env/page.tsx
// REMOVE THIS FILE AFTER DEBUGGING!

'use client'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'

export default function DebugEnvPage() {
  const [dbTest, setDbTest] = useState<any>(null)
  const [authTest, setAuthTest] = useState<any>(null)

  const testDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, status')
        .limit(1)
      
      setDbTest({ success: !error, data, error: error?.message })
    } catch (err: any) {
      setDbTest({ success: false, error: err.message })
    }
  }

  const testAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      setAuthTest({ 
        success: !error, 
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        error: error?.message 
      })
    } catch (err: any) {
      setAuthTest({ success: false, error: err.message })
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🐛 Debug Environment</h1>
      
      <div className="space-y-6">
        {/* Environment Variables */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> 
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? ' ✓ Set' : ' ✗ Not Set'}
              </span>
              <br />
              <span className="text-gray-600">{process.env.NEXT_PUBLIC_SUPABASE_URL}</span>
            </div>
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> 
              <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? ' ✓ Set' : ' ✗ Not Set'}
              </span>
              <br />
              <span className="text-gray-600">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...'
                  : 'Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Database Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
          <button
            onClick={testDatabase}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
          >
            Test Database Connection
          </button>
          {dbTest && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(dbTest, null, 2)}
            </pre>
          )}
        </div>

        {/* Auth Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <button
            onClick={testAuth}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
          >
            Test Auth Session
          </button>
          {authTest && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(authTest, null, 2)}
            </pre>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-yellow-800">⚠️ Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-900">
            <li>Check if environment variables are set correctly</li>
            <li>Click "Test Database Connection" to verify database access</li>
            <li>Click "Test Auth Session" to verify you're logged in</li>
            <li>Check your browser console for detailed logs</li>
            <li>Try uploading a task file and check the server console</li>
            <li><strong>DELETE THIS FILE</strong> after debugging! (app/debug/env/page.tsx)</li>
          </ol>
        </div>

        {/* SQL Check */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">📋 Database Schema Check</h2>
          <p className="text-sm text-blue-900 mb-2">
            Your <code>tasks</code> table should have these columns:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-900 font-mono">
            <li>id (uuid, primary key)</li>
            <li>title (text)</li>
            <li>description (text)</li>
            <li>status (text) - should allow 'todo', 'done'</li>
            <li>file_url (text) - THIS IS WHERE WE STORE THE BASE64 JSON</li>
            <li>created_by (uuid, foreign key to auth.users)</li>
            <li>course (text)</li>
            <li>assignee (text)</li>
            <li>priority (text)</li>
            <li>due_at (timestamp)</li>
            <li>created_at (timestamp)</li>
          </ul>
          <p className="text-sm text-blue-900 mt-3">
            <strong>Important:</strong> The <code>file_url</code> column should be <code>text</code> type, not varchar!
          </p>
        </div>
      </div>
    </div>
  )
}