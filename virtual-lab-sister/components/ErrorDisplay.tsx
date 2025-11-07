'use client'

interface ErrorDisplayProps {
  error: {
    status?: number
    message: string
    details?: any
  } | null
  onDismiss?: () => void
}

export default function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error) return null

  const getStatusColor = (status?: number) => {
    if (!status) return 'bg-red-100 border-red-400 text-red-700'
    if (status >= 500) return 'bg-red-100 border-red-400 text-red-700'
    if (status >= 400) return 'bg-yellow-100 border-yellow-400 text-yellow-700'
    return 'bg-blue-100 border-blue-400 text-blue-700'
  }

  const getStatusText = (status?: number) => {
    if (!status) return 'Error'
    if (status === 400) return 'Bad Request (400)'
    if (status === 401) return 'Unauthorized (401)'
    if (status === 403) return 'Forbidden (403)'
    if (status === 404) return 'Not Found (404)'
    if (status === 500) return 'Server Error (500)'
    return `Error (${status})`
  }

  return (
    <div className={`border px-4 py-3 rounded relative ${getStatusColor(error.status)}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <strong className="font-bold">{getStatusText(error.status)}</strong>
          <span className="block sm:inline ml-2">{error.message}</span>
          {error.details && (
            <pre className="mt-2 text-xs overflow-auto bg-white/50 p-2 rounded">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-xl font-bold leading-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}