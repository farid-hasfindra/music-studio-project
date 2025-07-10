'use client'

import { useState } from 'react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Registrasi berhasil! Silakan login.')
        setName('')
        setEmail('')
        setPassword('')
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Terjadi kesalahan saat registrasi')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form className="space-y-4" onSubmit={handleRegister}>
        <input className="w-full border p-2" type="text" placeholder="Nama Lengkap"
          value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border p-2" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Daftar</button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  )
}
