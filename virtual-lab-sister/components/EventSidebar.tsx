'use client'

const categoryColors: { [key: string]: string } = {
  "Deadline Mahasiswa": 'bg-red-500',
  "Tugas Asisten": 'bg-blue-500',
  "Praktikum": 'bg-green-500',
  "Rapat": 'bg-purple-500',
  "Lainnya": 'bg-gray-500',
}

const formatEventTime = (time: string) => {
  const date = new Date(time)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function EventSidebar({ events }: { events: any[] }) {

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-gray-900 mb-4">Event Mendatang</h3>
        <div className="space-y-5">
          {events.length > 0 ? events.map(event => {
            const color = categoryColors[event.category] || 'bg-gray-500'
            return (
              <div key={event.id} className="flex gap-3">
                <div className={`w-1 flex-shrink-0 rounded-full ${color}`}></div>
                <div>
                  <h4 className="font-medium text-sm text-gray-800">{event.title}</h4>
                  <p className="text-xs text-gray-500">{event.category}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatEventTime(event.start_time)}</p>
                  {event.assignee && (
                    <p className="text-xs text-gray-500 mt-1">oleh: {event.assignee}</p>
                  )}
                </div>
              </div>
            )
          }) : (
            <p className="text-sm text-gray-500">Tidak ada event mendatang.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold text-gray-900 mb-4">Legenda</h3>
        <div className="space-y-2">
          {Object.entries(categoryColors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${value}`}></div>
              <span className="text-sm text-gray-600">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}