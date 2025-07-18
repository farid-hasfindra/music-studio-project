"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Dummy rekening, nanti fetch dari backend
const rekening = [
  { bank: "BCA", nomor: "1234567890", nama: "Resty Music Studio" },
  { bank: "Mandiri", nomor: "9876543210", nama: "Resty Music Studio" },
];

export default function KonfirmasiPembayaran() {
  const params = useSearchParams();
  const router = useRouter();
  const [pesanan, setPesanan] = useState(null);
  const [waktuSisa, setWaktuSisa] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ambil pesanan terakhir dari localStorage
      const lastOrder = window.localStorage.getItem("lastOrder");
      if (lastOrder) {
        const order = JSON.parse(lastOrder);
        setPesanan(order);
        // Hitung waktu sisa (3 jam)
        const now = Date.now();
        const expire = order.expireAt || (now + 3 * 60 * 60 * 1000);
        setWaktuSisa(Math.max(0, Math.floor((expire - now) / 1000)));
        // Timer countdown
        const timer = setInterval(() => {
          const now2 = Date.now();
          const sisa = Math.max(0, Math.floor((expire - now2) / 1000));
          setWaktuSisa(sisa);
          if (sisa <= 0) clearInterval(timer);
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, []);

  // Copy nomor rekening
  const handleCopy = (nomor) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(nomor);
      alert("Nomor rekening berhasil disalin!");
    }
  };

  if (!pesanan) return <div className="text-center p-8">Pesanan tidak ditemukan.</div>;

  // Format waktu sisa
  const jam = Math.floor(waktuSisa / 3600);
  const menit = Math.floor((waktuSisa % 3600) / 60);
  const detik = waktuSisa % 60;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-400 text-center">Konfirmasi Pembayaran</h1>
        <div className="mb-4">
          <div className="font-semibold mb-2">Detail Pesanan:</div>
          <ul className="text-sm space-y-1">
            <li>Username: <span className="font-bold">{pesanan.username}</span></li>
            <li>Hari: <span className="font-bold">{pesanan.hari}</span></li>
            <li>Minggu ke: <span className="font-bold">{pesanan.mingguKe}</span></li>
            <li>Jam Mulai: <span className="font-bold">{pesanan.jamMulai}</span></li>
            <li>Jam Akhir: <span className="font-bold">{pesanan.jamAkhir}</span></li>
            <li>Total Jam: <span className="font-bold">{pesanan.totalJam}</span></li>
            <li>Ruangan: <span className="font-bold">{pesanan.ruangan}</span></li>
            <li>Total Biaya: <span className="font-bold text-blue-400">Rp {pesanan.totalHarga.toLocaleString('id-ID')}</span></li>
          </ul>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Transfer ke Rekening:</div>
          {rekening.map((r, idx) => (
            <div key={idx} className="bg-gray-800 rounded p-2 mb-2 flex items-center justify-between">
              <div>
                <span className="font-semibold">{r.bank}</span> - <span className="font-mono">{r.nomor}</span> a.n. <span>{r.nama}</span>
              </div>
              <button onClick={() => handleCopy(r.nomor)} className="ml-2 px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded text-xs">Copy</button>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="font-semibold">Status Pesanan: <span className={pesanan.status === 'pending' ? 'text-yellow-400' : 'text-green-400'}>{pesanan.status === 'pending' ? 'Pending' : 'Berhasil'}</span></div>
          <div className="text-xs text-gray-400 mt-1">Menunggu persetujuan admin maksimal 3 jam.</div>
          {waktuSisa > 0 && <div className="text-xs mt-1">Sisa waktu: {jam} jam {menit} menit {detik} detik</div>}
          {waktuSisa === 0 && pesanan.status === 'pending' && <div className="text-red-400 mt-2">Pesanan dibatalkan otomatis karena melebihi batas waktu.</div>}
        </div>
        <button onClick={() => router.push('/')} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-lg mt-2">Kembali ke Beranda</button>
      </div>
    </div>
  );
}
