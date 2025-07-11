'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

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

  // Simulasi harga per jam
  const hargaPerJam = 50000;
  const totalHarga = (parseInt(dataBooking.totalJam) || 0) * hargaPerJam;

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Tombol kembali di kiri atas, di luar komponen pembayaran */}
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
              <li>Hari: <span className="font-bold">{dataBooking.hari}</span></li>
              <li>Minggu ke: <span className="font-bold">{parseInt(dataBooking.mingguKe)+1}</span></li>
              <li>Jam Mulai: <span className="font-bold">{dataBooking.jamMulai}</span></li>
              <li>Jam Akhir: <span className="font-bold">{dataBooking.jamAkhir}</span></li>
              <li>Total Jam: <span className="font-bold">{dataBooking.totalJam}</span></li>
              <li>Ruangan: <span className="font-bold">{dataBooking.ruangan}</span></li>
            </ul>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Pilih Metode Pembayaran:</div>
            <select className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700">
              <option>Transfer Bank</option>
              <option>QRIS</option>
              <option>OVO</option>
              <option>DANA</option>
              <option>Gopay</option>
              <option>Tunai di Tempat</option>
            </select>
          </div>
          <div className="mb-6 text-lg font-bold text-right">
            Total Biaya: <span className="text-blue-400">Rp {totalHarga.toLocaleString('id-ID')}</span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-lg">Konfirmasi Pembelian</button>
        </div>
      </div>
    </div>
  );
}
