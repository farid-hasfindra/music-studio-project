"use client";
import { useEffect, useState } from "react";

export default function AdminPesanan() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      let allOrders = [];
      try {
        allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
      } catch {}
      setOrders(allOrders);
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
      setOrders([...allOrders]);
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
      setOrders([...allOrders]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6 text-blue-400 text-center">Daftar Pesanan Booking</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-400">Belum ada pesanan.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o, idx) => (
            <div key={idx} className={`rounded-lg p-4 shadow flex flex-col gap-1 border ${o.status === 'pending' ? 'bg-gray-900 border-blue-900' : o.status === 'berhasil' ? 'bg-green-900 border-green-700' : 'bg-red-900 border-red-700'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{o.username}</span>
                <span className={
                  o.status === 'pending' ? 'text-yellow-400' :
                  o.status === 'berhasil' ? 'text-green-400' :
                  'text-red-400'
                }>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span>
              </div>
              <div className="text-xs text-gray-400 mb-1">{new Date(o.createdAt).toLocaleString('id-ID')}</div>
              <div className="text-sm">Ruangan: <span className="font-bold">{o.ruangan}</span></div>
              <div className="text-sm">Hari: <span className="font-bold">{o.hari}</span></div>
              <div className="text-sm">Jam: <span className="font-bold">{o.jamMulai} - {o.jamAkhir}</span></div>
              <div className="text-sm">Total: <span className="font-bold text-blue-400">Rp {o.totalHarga.toLocaleString('id-ID')}</span></div>
              {o.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleKonfirmasi(idx)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">Konfirmasi Pesanan</button>
                  <button onClick={() => handleBatal(idx)} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Batalkan Pesanan</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
