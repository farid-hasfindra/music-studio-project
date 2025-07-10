// src/app/layout.js
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Booking Studio Musik',
  description: 'Sewa studio musik dengan mudah',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-100 text-gray-800">
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center p-0 m-0">{children}</main>
      </body>
    </html>
  )
}
