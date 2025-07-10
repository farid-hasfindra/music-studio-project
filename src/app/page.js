// src/app/page.js
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full min-h-[60vh]">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg text-center">
          Selamat Datang di Resty Music Studio
        </h1>
        <p className="mb-10 text-gray-300 max-w-xl text-lg leading-relaxed text-center">
          Nikmati kemudahan booking studio musik secara online.<br />
          Lihat antrian dan jadwal studio favoritmu dengan mudah!
        </p>
        <Link href="/booking" className="flex justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white px-8 py-4 rounded-xl shadow-lg font-bold text-xl">
            Booking Sekarang!
          </button>
        </Link>
      </div>
      <footer className="w-full text-center absolute bottom-4 left-0 text-gray-500 text-sm">&copy; {new Date().getFullYear()} Resty Music Studio. All rights reserved.</footer>
    </>
  )
}
