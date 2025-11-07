'use client'

interface SuccessDisplayProps {
  message: string
  onDismiss?: () => void
}

export default function SuccessDisplay({ message, onDismiss }: SuccessDisplayProps) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
      <div className="flex justify-between items-center">
        <span>✓ {message}</span>
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