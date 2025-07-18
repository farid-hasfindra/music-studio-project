"use client";
import { useEffect, useState } from "react";

export default function PesananNotif() {
  const [orders, setOrders] = useState([]);

  // Ambil seluruh pesanan pending dari localStorage
  useEffect(() => {
    const fetchOrders = () => {
      let allOrders = [];
      try {
        allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
      } catch {}
      setOrders(allOrders.filter(o => o.status === 'pending'));
    };
    fetchOrders();
    window.addEventListener('storage', fetchOrders);
    return () => window.removeEventListener('storage', fetchOrders);
  }, []);

  // Konfirmasi pesanan
  const handleKonfirmasi = (idx) => {
    let allOrders = [];
    try {
      allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
    } catch {}
    const order = orders[idx];
    const i = allOrders.findIndex(o => o.createdAt === order.createdAt && o.username === order.username);
    if (i !== -1) {
      allOrders[i].status = 'berhasil';
      localStorage.setItem('allOrders', JSON.stringify(allOrders));
      setOrders(allOrders.filter(o => o.status === 'pending'));
    }
  };

  // Batalkan pesanan
  const handleBatal = (idx) => {
    let allOrders = [];
    try {
      allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
    } catch {}
    const order = orders[idx];
    const i = allOrders.findIndex(o => o.createdAt === order.createdAt && o.username === order.username);
    if (i !== -1) {
      allOrders[i].status = 'dibatalkan';
      localStorage.setItem('allOrders', JSON.stringify(allOrders));
      setOrders(allOrders.filter(o => o.status === 'pending'));
    }
  };

  return (
    <div className="w-full max-w-xs bg-gray-900 text-white rounded-lg shadow-lg p-4 sticky top-6">
      <h3 className="text-lg font-bold mb-4 text-blue-400">Notifikasi Pesanan Masuk</h3>
      {orders.length === 0 ? (
        <div className="text-gray-400 text-sm">Belum ada pesanan baru.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o, idx) => (
            <div key={idx} className="bg-gray-800 rounded p-3 flex flex-col gap-1 border border-blue-900">
              <div className="font-semibold">{o.username}</div>
              <div className="text-xs text-gray-400 mb-1">{new Date(o.createdAt).toLocaleString('id-ID')}</div>
              <div className="text-sm">Ruangan: <span className="font-bold">{o.ruangan}</span></div>
              <div className="text-sm">Hari: <span className="font-bold">{o.hari}</span></div>
              <div className="text-sm">Jam: <span className="font-bold">{o.jamMulai} - {o.jamAkhir}</span></div>
              <div className="text-sm">Total: <span className="font-bold text-blue-400">Rp {o.totalHarga.toLocaleString('id-ID')}</span></div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleKonfirmasi(idx)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">Konfirmasi Pesanan</button>
                <button onClick={() => handleBatal(idx)} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Batalkan Pesanan</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
