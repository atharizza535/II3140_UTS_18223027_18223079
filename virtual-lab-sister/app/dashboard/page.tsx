// app/dashboard/page.tsx
import Protected from '@/components/Protected'

export default function DashboardPage() {
  return (
    <Protected>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
        <p>Welcome to your assistant dashboard!</p>
      </div>
    </Protected>
  )
}
