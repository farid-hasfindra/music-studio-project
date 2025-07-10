// src/app/page.js
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 flex flex-col items-center max-w-2xl w-full border border-blue-100">
        <img src="/logo.png" alt="Resty Music Studio Logo" className="w-24 h-24 mb-4 rounded-full shadow-lg border-4 border-blue-200" />
        <h1 className="text-5xl font-extrabold text-gray-800 mb-2 tracking-tight drop-shadow-lg">Selamat Datang di</h1>
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Resty Music Studio</h2>
        <p className="mb-8 text-gray-600 max-w-xl text-lg leading-relaxed">
          Sewa studio musik favoritmu secara online, cepat, dan praktis.<br />
          <span className="font-semibold text-blue-500">Login</span> atau <span className="font-semibold text-blue-500">daftar</span> dulu ya!
        </p>
        <div className="flex gap-6 w-full justify-center">
          <Link href="/login" className="w-1/2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-lg">Login</button>
          </Link>
          <Link href="/register" className="w-1/2">
            <button className="w-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 text-gray-800 px-6 py-3 rounded-xl font-semibold text-lg">Register</button>
          </Link>
        </div>
      </div>
      <footer className="mt-10 text-gray-400 text-sm">&copy; {new Date().getFullYear()} Resty Music Studio. All rights reserved.</footer>
    </main>
  )
}
