'use client'
import { useMemo } from 'react'

const categoryColors: { [key: string]: { bg: string, text: string } } = {
  "Deadline Mahasiswa": { bg: 'bg-red-100', text: 'text-red-800' },
  "Tugas Asisten": { bg: 'bg-blue-100', text: 'text-blue-800' },
  "Praktikum": { bg: 'bg-green-100', text: 'text-green-800' },
  "Rapat": { bg: 'bg-purple-100', text: 'text-purple-800' },
  "Lainnya": { bg: 'bg-gray-100', text: 'text-gray-800' },
}

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function CalendarView({ month, year, events }: { month: number, year: number, events: any[] }) {

  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay() 
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    let days = []
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ key: `empty-${i}`, date: null, events: [] })
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      
      const eventsForDay = events.filter(e => {
        const eventDate = new Date(e.start_time)
        return eventDate.getDate() === day &&
               eventDate.getMonth() === month &&
               eventDate.getFullYear() === year
      })
      
      days.push({ key: `day-${day}`, date, events: eventsForDay })
    }
    return days
  }, [month, year, events])

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
        {DAY_NAMES.map(day => <div key={day}>{day}</div>)}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarGrid.map(cell => (
          <div
            key={cell.key}
            className={`h-28 border border-gray-100 p-2 ${cell.date ? 'bg-white' : 'bg-gray-50'}`}
          >
            {cell.date && (
              <>
                <div className="text-sm font-medium text-gray-800">
                  {cell.date.getDate()}
                </div>
                <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                  {cell.events.map(event => {
                    const colors = categoryColors[event.category] || categoryColors.Lainnya
                    return (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded truncate ${colors.bg} ${colors.text}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}