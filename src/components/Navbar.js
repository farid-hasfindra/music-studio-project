'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);

  // Helper untuk update user dari token
  const updateUserFromToken = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          // DEBUG: log payload
          console.log('JWT payload:', payload);
          if ((payload.username || payload.name) && payload.email) {
            setUser({ username: payload.username || payload.name, email: payload.email });
          } else {
            setUser(null);
          }
        } catch (e) {
          console.log('JWT decode error:', e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    updateUserFromToken();
    // Listen to storage event (for multi-tab sync)
    const onStorage = () => updateUserFromToken();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowProfile(false);
    window.location.href = '/login';
  };

  const linkStyle = (path) =>
    pathname === path
      ? 'text-blue-600 font-semibold underline'
      : 'text-gray-300 hover:text-blue-600 transition';

  return (
    <nav className="bg-black shadow-none p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">Resty Music Studio</h1>
        <div className="space-x-4 flex items-center">
          <Link href="/" className={linkStyle('/')}>Home</Link>
          <Link href="/booking" className={linkStyle('/booking')}>Booking</Link>
          <Link href="/login" className={linkStyle('/login')}>Login</Link>
          {/* Tombol Profile */}
          <button
            className="ml-4 relative rounded-full bg-gray-800 hover:bg-gray-700 p-2 text-white focus:outline-none"
            onClick={() => setShowProfile((v) => !v)}
            aria-label="Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.25a7.25 7.25 0 1115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
            </svg>
          </button>
          {/* Dropdown Profile */}
          {showProfile && (
            <div className="absolute right-4 top-16 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 min-w-[220px] z-50 animate-fade-in flex flex-col" style={{minHeight: 120}}>
              {user ? (
                <>
                  <div className="mb-2">
                    <div className="font-bold text-blue-400">{user.username}</div>
                    <div className="text-gray-300 text-sm">{user.email}</div>
                  </div>
                  <div className="flex-1" />
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mt-auto"
                    onClick={handleLogout}
                  >Logout</button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
                  <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.2s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}
