'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Ambil data user dari token JWT
  const updateUserFromToken = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if ((payload.username || payload.name) && payload.email) {
            setUser({ username: payload.username || payload.name, email: payload.email });
          } else {
            setUser(null);
          }
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    updateUserFromToken();
    // Sync antar tab jika login/logout di tab lain
    const onStorage = () => updateUserFromToken();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [pathname]);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

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
          {!user && (
            <Link href="/login" className={linkStyle('/login')}>Login</Link>
          )}
          {/* Tombol Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="ml-2 rounded-full bg-gray-800 hover:bg-gray-700 p-2 text-white focus:outline-none"
              onClick={() => setShowProfile((v) => !v)}
              aria-label="Profile"
            >
              {user ? (
                <span className="font-bold text-lg">
                  {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.25a7.25 7.25 0 1115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
                </svg>
              )}
            </button>
            {/* Dropdown Profile */}
            {showProfile && user && (
              <div className="absolute right-0 mt-3 w-56 bg-gray-900 text-white rounded shadow-lg p-4 z-50">
                <div className="mb-3">
                  <div className="font-semibold text-base">{user.username}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
                <button
                  className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
            {/* Jika belum login, dropdown kosong/tidak muncul */}
          </div>
        </div>
      </div>
    </nav>
  );
}