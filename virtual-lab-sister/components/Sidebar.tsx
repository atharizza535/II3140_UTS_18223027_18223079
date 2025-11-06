'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/tasks', label: 'Tasks' },
  { href: '/dashboard/announcements', label: 'Announcements' },
  { href: '/dashboard/wiki', label: 'Wiki' },
  { href: '/virtual-lab', label: 'Virtual Lab' }
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 bg-indigo-700 text-white flex flex-col">
      <h1 className="text-2xl font-bold p-4">Virtual Lab</h1>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded ${
              pathname.startsWith(item.href)
                ? 'bg-indigo-500'
                : 'hover:bg-indigo-600'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
