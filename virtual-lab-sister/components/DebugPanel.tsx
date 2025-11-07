'use client'
import { useState } from 'react'

interface DebugPanelProps {
  data: any
  label: string
}

export default function DebugPanel({ data, label }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="border border-gray-300 rounded p-2 bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-mono text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        <span>{isOpen ? '▼' : '▶'}</span>
        <span>🐛 {label}</span>
      </button>
      {isOpen && (
        <pre className="mt-2 text-xs overflow-auto bg-white p-2 rounded border">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}