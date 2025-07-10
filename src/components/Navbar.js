'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const linkStyle = (path) =>
    pathname === path
      ? 'text-blue-600 font-semibold underline'
      : 'text-gray-300 hover:text-blue-600 transition'

  return (
    <nav className="bg-black shadow-none p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">Resty Music Studio</h1>
        <div className="space-x-4">
          <Link href="/" className={linkStyle('/')}>Home</Link>
          <Link href="/booking" className={linkStyle('/booking')}>Booking</Link>
          <Link href="/login" className={linkStyle('/login')}>Login</Link>
        </div>
      </div>
    </nav>
  )
}
