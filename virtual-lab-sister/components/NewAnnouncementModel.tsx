'use client'
import { useState } from 'react'

interface NewAnnouncementModalProps {
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
}


const courses = [
  "Jaringan Komputer",
  "Sistem Operasi",
  "Sistem dan Arsitektur Komputer",
  "Organisasi dan Arsitektur komputer",
  "Teknologi Platform",
  "Sistem Paralel dan terdistribusi"
]

export default function NewAnnouncementModal({ onClose, onSubmit }: NewAnnouncementModalProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    await onSubmit(formData)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          disabled={loading}
        >
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Buat Pengumuman Baru</h2>
            <p className="text-sm text-gray-500">Pengumuman akan dilihat oleh semua asisten.</p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Judul Pengumuman
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Masukkan judul"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Konten
              </label>
              <textarea
                name="content"
                id="content"
                rows={4}
                placeholder="Isi pengumuman..."
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
                Mata Kuliah
              </label>
              <select
                name="tag" 
                id="tag"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                defaultValue=""
                required
              >
                <option value="" disabled>Pilih mata kuliah terkait</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Membuat...' : 'Buat Pengumuman'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}