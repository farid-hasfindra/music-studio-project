'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [showProfile, setShowProfile] = useState(false)
  const [user, setUser] = useState(null)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  // Ambil data user dari token JWT
  const getUserFromToken = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      console.log('[DEBUG] Token dari localStorage:', token)
      if (token) {
        try {
          const parts = token.split('.')
          if (parts.length !== 3) {
            console.log('[DEBUG] Format JWT tidak valid:', token)
            return null
          }
          const payloadStr = atob(parts[1])
          console.log('[DEBUG] Payload JWT (base64 decoded):', payloadStr)
          const payload = JSON.parse(payloadStr)
          // Anggap user valid jika ada email
          if (payload.email) {
            return {
              username: payload.username || payload.name || payload.email.split('@')[0],
              email: payload.email,
              role: payload.role || 'user',
            }
          } else {
            console.log('[DEBUG] Payload JWT tidak mengandung email:', payload)
          }
        } catch (e) {
          console.log('JWT Parse error:', e)
          return null
        }
      } else {
        console.log('[DEBUG] Tidak ada token di localStorage')
      }
    }
    return null
  }

  useEffect(() => {
    const updateUser = () => {
      const u = getUserFromToken()
      setUser(u)
      if (u) {
        console.log('[STATUS] Sedang Login')
        console.log('[INFO] User:', u)
      } else {
        console.log('[STATUS] Sudah Logout')
      }
    }
    updateUser()
    // Polling singkat jika user masih null (misal setelah login/redirect)
    if (!getUserFromToken()) {
      const poll = setTimeout(() => {
        updateUser()
      }, 300)
      return () => clearTimeout(poll)
    }
    window.addEventListener('storage', updateUser)
    window.addEventListener('authChanged', updateUser)
    // Juga update user saat halaman /admin diakses langsung
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', updateUser)
    }
    return () => {
      window.removeEventListener('storage', updateUser)
      window.removeEventListener('authChanged', updateUser)
      if (typeof window !== 'undefined') {
        document.removeEventListener('visibilitychange', updateUser)
      }
    }
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowProfile(false)
      }
    }
    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfile])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setShowProfile(false)
    console.log('[STATUS] Sudah Logout')
    window.dispatchEvent(new Event('authChanged'))
    window.location.href = '/login'
  }

  const linkStyle = (path) =>
    pathname === path
      ? 'text-blue-600 font-semibold underline'
      : 'text-gray-300 hover:text-blue-600 transition'


  return (
    <nav className="bg-black shadow-none p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">Resty Music Studio</h1>
        <div className="space-x-4 flex items-center">
          {/* Menu untuk admin */}
          {user && user.role === 'admin' ? (
            <>
              <Link href="/admin" className={linkStyle('/admin')}>Dashboard</Link>
              <Link href="/admin/booking" className={linkStyle('/admin/booking')}>Booking</Link>
              <Link href="/admin/pesanan" className={linkStyle('/admin/pesanan')}>Pesanan</Link>
              <Link href="/admin/fasilitas" className={linkStyle('/admin/fasilitas')}>Fasilitas</Link>
              <Link href="/admin/laporan" className={linkStyle('/admin/laporan')}>Laporan</Link>
              <Link href="/admin/users" className={linkStyle('/admin/users')}>Users</Link>
            </>
          ) : (
            <>
              <Link href="/" className={linkStyle('/')}>Home</Link>
              <Link href="/booking" className={linkStyle('/booking')}>Booking</Link>
              {user && (
                <Link href="/history" className={linkStyle('/history')}>History Booking</Link>
              )}
              {!user && (
                <Link href="/login" className={linkStyle('/login')}>Login</Link>
              )}
            </>
          )}
          {/* Tombol Profile hanya ikon, baik user maupun admin */}
          <div className="relative flex items-center">
            <button
              ref={buttonRef}
              className="ml-2 rounded-full bg-gray-800 hover:bg-gray-700 p-2 text-white focus:outline-none"
              onClick={e => {
                e.stopPropagation();
                setShowProfile(v => !v)
              }}
              aria-label="Profile"
              type="button"
              style={{ zIndex: 1000, pointerEvents: 'auto' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.25a7.25 7.25 0 1115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
              </svg>
            </button>
            {user && showProfile && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-3 w-56 bg-gray-900 text-white rounded shadow-lg p-4"
                style={{ zIndex: 2000, pointerEvents: 'auto' }}
              >
                <div className="mb-3">
                  <div className="font-semibold text-base">{user.username}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
                <button
                  className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}