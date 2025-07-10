// src/app/layout.js
import Navbar from '@/components/Navbar'
import '@/app/globals.css'

export const metadata = {
  title: 'Booking Studio Musik',
  description: 'Sewa studio musik dengan mudah',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="bg-black">
      <body className="bg-black text-gray-100 flex flex-col min-h-screen p-0 m-0">
        <Navbar />
        <main className="flex-1 flex items-center justify-center w-full bg-black">
          <div className="w-full max-w-3xl bg-black/80 rounded-2xl shadow-2xl p-10 flex flex-col items-center">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
