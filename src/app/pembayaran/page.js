"use client";

export const dynamic = 'force-dynamic'; // <- Tambahan penting agar halaman tidak di-prerender

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function PembayaranPage() {
  const params = useSearchParams();

  // Ambil data booking dari query string
  const dataBooking = useMemo(() => ({
    hari: params.get('hari') || '',
    mingguKe: params.get('mingguKe') || '',
    jamMulai: params.get('jamMulai') || '',
    jamAkhir: params.get('jamAkhir') || '',
    totalJam: params.get('totalJam') || '',
    ruangan: params.get('ruangan') || '',
  }), [params]);

  // Ambil username dari JWT (localStorage)
  const [username, setUsername] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUsername(payload.username || payload.name || (payload.email ? payload.email.split('@')[0] : ''));
        } catch (err) {
          console.error("Gagal mem-parsing token:", err);
        }
      }
    }
  }, []);

  // Simulasi harga per jam
  const hargaPerJam = 50000;
  const totalHarga = (parseInt(dataBooking.totalJam) || 0) * hargaPerJam;

  const router = useRouter();

  // Konfirmasi pembayaran: simpan pesanan ke localStorage dan redirect
  const handleKonfirmasi = () => {
    const pesanan = {
      username,
      hari: dataBooking.hari,
      mingguKe: parseInt(dataBooking.mingguKe) + 1,
      jamMulai: dataBooking.jamMulai,
      jamAkhir: dataBooking.jamAkhir,
      totalJam: dataBooking.totalJam,
      ruangan: dataBooking.ruangan,
      totalHarga,
      status: 'pending',
      createdAt: Date.now(),
      expireAt: Date.now() + 3 * 60 * 60 * 1000,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('lastOrder', JSON.stringify(pesanan));
      let allOrders = [];
      try {
        allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
      } catch {}
      allOrders.push(pesanan);
      localStorage.setItem('allOrders', JSON.stringify(allOrders));
    }

    router.push('/pembayaran/konfirmasi');
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Tombol kembali di kiri atas */}
      <button
        className="absolute top-6 left-6 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-md border border-gray-700 z-20 flex items-center justify-center"
        style={{ width: 40, height: 40 }}
        onClick={() => window.history.back()}
        aria-label="Kembali"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-gray-900 rounded-xl p-8 shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-blue-400 text-center">Pembayaran Booking Studio</h1>
          <div className="mb-4">
            <div className="font-semibold mb-2">Detail Pesanan:</div>
            <ul className="text-sm space-y-1">
              <li>Username: <span className="font-bold">{username}</span></li>
              <li>Hari: <span className="font-bold">{dataBooking.hari}</span></li>
              <li>Minggu ke: <span className="font-bold">{parseInt(dataBooking.mingguKe) + 1}</span></li>
              <li>Jam Mulai: <span className="font-bold">{dataBooking.jamMulai}</span></li>
              <li>Jam Akhir: <span className="font-bold">{dataBooking.jamAkhir}</span></li>
              <li>Total Jam: <span className="font-bold">{dataBooking.totalJam}</span></li>
              <li>Ruangan: <span className="font-bold">{dataBooking.ruangan}</span></li>
            </ul>
          </div>

          <div className="mb-4">
            <div className="font-semibold mb-2">Metode Pembayaran:</div>
            <div className="bg-gray-800 rounded p-3 mb-2">
              <div className="font-bold text-blue-300 mb-1">Transfer Bank</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Nomor rekening akan ditampilkan setelah konfirmasi pembayaran.
            </div>
          </div>

          <div className="mb-6 text-lg font-bold text-right">
            Total Biaya: <span className="text-blue-400">Rp {totalHarga.toLocaleString('id-ID')}</span>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-lg"
            onClick={handleKonfirmasi}
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
