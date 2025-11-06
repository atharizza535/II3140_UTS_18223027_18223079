'use client'
import { useState } from 'react'
import SimpleMDE from 'react-simplemde-editor'
import ReactMarkdown from 'react-markdown'

export default function WikiEditor({
  initialValue = '',
  onSave,
}: {
  initialValue?: string
  onSave: (val: string) => void
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="space-y-3">
      <SimpleMDE value={value} onChange={setValue} />
      <button
        className="bg-indigo-600 text-white px-3 py-2 rounded"
        onClick={() => onSave(value)}
      >
        Save
      </button>
      <div className="prose bg-white p-4 rounded shadow">
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    </div>
  )
}
