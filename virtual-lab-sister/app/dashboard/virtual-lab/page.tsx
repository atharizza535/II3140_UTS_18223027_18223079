export default function VirtualLabPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">🧪 Virtual Lab</h1>
      <p className="text-gray-700">Choose a lab module below:</p>
      <ul className="list-disc ml-6">
        <li><a href="/dashboard/virtual-lab/ctf" className="text-blue-600 hover:underline">CTF Challenge</a></li>
        <li><a href="/dashboard/virtual-lab/leaderboard" className="text-blue-600 hover:underline">Leaderboard</a></li>
        <li><a href="/dashboard/virtual-lab/terminal" className="text-blue-600 hover:underline">Terminal Access</a></li>
      </ul>
    </div>
  )
}
