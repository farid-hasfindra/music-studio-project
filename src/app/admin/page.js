'use client'


import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [])

  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
        <p className="mb-6">Selamat datang, Admin! Pilih menu di bawah untuk mengelola aplikasi.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Link href="/admin/booking" className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow p-6 flex flex-col items-center transition cursor-pointer">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="font-semibold">Booking</span>
          </Link>
          <Link href="/admin/fasilitas" className="bg-green-700 hover:bg-green-800 text-white rounded-lg shadow p-6 flex flex-col items-center transition cursor-pointer">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 21m5.25-4l.75 4M4 21h16M4 10V7a4 4 0 014-4h8a4 4 0 014 4v3M4 10h16M4 10v11m16-11v11" /></svg>
            <span className="font-semibold">Fasilitas</span>
          </Link>
          <Link href="/admin/laporan" className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg shadow p-6 flex flex-col items-center transition cursor-pointer">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="font-semibold">Laporan</span>
          </Link>
          <Link href="/admin/users" className="bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow p-6 flex flex-col items-center transition cursor-pointer">
            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span className="font-semibold">Users</span>
          </Link>
        </div>
      </div>
      {/* Notifikasi pesanan masuk sudah dipindah ke halaman /admin/pesanan */}
    </div>
  )
}