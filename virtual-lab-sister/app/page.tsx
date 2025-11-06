import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <h1 className="text-4xl font-bold">Virtual Lab Sister</h1>
      <p className="text-gray-600">A unified assistant platform for tasks, wiki, and experiments.</p>
      <div className="space-x-4">
        <Link href="/auth/login" className="px-4 py-2 bg-indigo-600 text-white rounded-xl">Login</Link>
        <Link href="/virtual-lab" className="px-4 py-2 bg-gray-200 rounded-xl">Try Virtual Lab</Link>
      </div>
    </main>
  )
}
