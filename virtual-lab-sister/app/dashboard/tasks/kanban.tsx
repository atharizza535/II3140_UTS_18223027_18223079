'use client'
import KanbanTaskCard from '@/components/KanbanTaskCard' 


const STATUSES = [
  { id: 'todo', title: 'To-Do' },
  { id: 'done', title: 'Done' }
]

export default function Kanban({ tasks, onTaskUpdate }: { tasks: any[], onTaskUpdate: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {STATUSES.map(status => {
        const tasksInColumn = tasks.filter(t => t.status === status.id)
        
        return (
          <div key={status.id} className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
              {status.title}
              <span className="ml-2 bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {tasksInColumn.length}
              </span>
            </h3>
            
            <div className="space-y-4">
              {tasksInColumn.length > 0 ? (
                tasksInColumn.map(task => (
                  <KanbanTaskCard
                    key={task.id}
                    task={task}
                    onTaskUpdate={onTaskUpdate} 
                  />
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-10">
                  <p>Tidak ada tugas di sini.</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}