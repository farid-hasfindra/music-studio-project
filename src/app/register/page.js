'use client'

import { useState } from 'react'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Registrasi berhasil! Silakan login.')
        setUsername('')
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
        <input className="w-full border p-2" type="text" placeholder="Username"
          value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full border p-2" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Daftar</button>
      </form>
      <div className="mt-4 text-center">
        Sudah punya akun?{' '}
        <a href="/login" className="text-blue-500 hover:underline">Login disini!</a>
      </div>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  )
}
