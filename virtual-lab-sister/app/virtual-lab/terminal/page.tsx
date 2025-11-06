import TerminalSimulator from '@/components/TerminalSimulator'

export default function TerminalPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Linux Terminal Simulation</h1>
      <TerminalSimulator />
    </main>
  )
}
