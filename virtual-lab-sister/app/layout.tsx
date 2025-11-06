import '../styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Virtual Lab Sister',
  description: 'Interactive dashboard and virtual lab for assistant coordination'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-100 text-gray-800`}>
        {children}
      </body>
    </html>
  )
}
