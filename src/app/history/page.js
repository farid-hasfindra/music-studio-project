"use client";
import { useEffect, useState } from "react";

export default function HistoryBooking() {
  const [orders, setOrders] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Ambil username dari JWT (localStorage)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUsername(payload.username || payload.name || (payload.email ? payload.email.split('@')[0] : ''));
        } catch {}
      }
    }
    // Ambil seluruh history booking user dari localStorage (dummy)
    const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
    setOrders(allOrders.filter(o => o.username === username));
  }, [username]);

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6 text-blue-400 text-center">History Booking</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-400">Belum ada catatan booking.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o, idx) => (
            <div key={idx} className="bg-gray-900 rounded-lg p-4 shadow flex flex-col gap-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{o.ruangan}</span>
                <span className={
                  o.status === 'pending' ? 'text-yellow-400' :
                  o.status === 'berhasil' ? 'text-green-400' :
                  'text-red-400'
                }>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span>
              </div>
              <div className="text-sm">Hari: <span className="font-bold">{o.hari}</span></div>
              <div className="text-sm">Minggu ke: <span className="font-bold">{o.mingguKe}</span></div>
              <div className="text-sm">Jam: <span className="font-bold">{o.jamMulai} - {o.jamAkhir}</span></div>
              <div className="text-sm">Total Jam: <span className="font-bold">{o.totalJam}</span></div>
              <div className="text-sm">Total Biaya: <span className="font-bold text-blue-400">Rp {o.totalHarga.toLocaleString('id-ID')}</span></div>
              <div className="text-xs text-gray-400 mt-1">Dipesan pada: {o.createdAt ? new Date(o.createdAt).toLocaleString('id-ID') : '-'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
