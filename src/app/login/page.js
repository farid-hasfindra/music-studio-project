'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [popup, setPopup] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const msg = sessionStorage.getItem('popupBooking');
      if (msg) {
        setPopup(msg);
        sessionStorage.removeItem('popupBooking');
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Login berhasil!')
        localStorage.setItem('token', data.token)
        window.dispatchEvent(new Event('authChanged'))
        setTimeout(() => {
          let role = 'user';
          try {
            const payload = JSON.parse(atob(data.token.split('.')[1]))
            role = payload.role || 'user';
          } catch (e) {}
          const redirectTo = searchParams.get('redirectTo');
          if (role === 'admin') {
            router.push('/admin');
          } else if (redirectTo) {
            router.push(redirectTo);
          } else {
            window.location.href = '/';
          }
        }, 800)
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Terjadi kesalahan saat login')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {popup && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded text-center">
          {popup}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleLogin}>
        <input className="w-full border p-2" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Login</button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
      <p className="mt-4 text-sm text-gray-600">Belum punya akun?{' '}
        <a href="/register" className="text-blue-600 hover:underline">Daftar dulu yuk!</a>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
