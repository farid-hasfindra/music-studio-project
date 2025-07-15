'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <p>Selamat datang, Admin! Di sini kamu bisa mengelola akun user, jadwal booking, dan lainnya.</p>
    </div>
  )
}