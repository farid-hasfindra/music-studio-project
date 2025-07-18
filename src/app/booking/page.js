"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function BookingClient() {
  const jadwal = [
    { hari: 'Senin', jam: '09.30–23.00', tutup: false },
    { hari: 'Selasa', jam: '09.30–23.00', tutup: false },
    { hari: 'Rabu', jam: '09.30–23.00', tutup: false },
    { hari: 'Kamis', jam: '09.30–23.00', tutup: false },
    { hari: 'Jumat', jam: '09.30–23.00', tutup: false },
    { hari: 'Sabtu', jam: '09.30–23.00', tutup: false },
    { hari: 'Minggu', jam: 'Tutup', tutup: true },
  ];

  const [selectedDay, setSelectedDay] = useState(null);
  const [ripple, setRipple] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [mingguKe, setMingguKe] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const bookingStudioRef = useRef(null);
  const nextSearchParams = useSearchParams();

  // Slot jam per 1 jam (09.30–23.00)
  const slotJam1Jam = [
    '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30', '22:30', '23:00'
  ];

  // State untuk jam mulai/akhir (index di slotJam1Jam)
  const [idxMulai, setIdxMulai] = useState(null);
  const [idxAkhir, setIdxAkhir] = useState(null);
  const [jamError, setJamError] = useState(null); // index yang error

  // Simulasi data booking yang sudah ada
  // Format: { hari: 'Senin', mingguKe: 0, slot: '09:00 - 11:00' }
  const bookings = [
    { hari: 'Senin', mingguKe: 0, slot: '09:00 - 11:00' },
    { hari: 'Senin', mingguKe: 0, slot: '13:00 - 15:00' },
    { hari: 'Rabu', mingguKe: 1, slot: '17:00 - 19:00' },
    // Tambahkan data simulasi lain jika perlu
  ];

  // Dapatkan slot yang sudah dibooking (per jam) untuk hari & mingguKe & ruangan terpilih
  const getSlotBooked = (hari, mingguKe, ruangan) => {
    // Ambil dari localStorage allOrders (pending/berhasil, belum expired)
    let allOrders = [];
    if (typeof window !== 'undefined') {
      try {
        allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
      } catch {}
    }
    const now = Date.now();
    // bookings dummy lama (jika masih ingin dipakai)
    let bookedIdx = bookings
      .filter(b => b.hari === hari && b.mingguKe === mingguKe)
      .map(b => b.slot)
      .flatMap(slot => {
        const [start, end] = slot.split(' - ');
        const startIdx = slotJam1Jam.findIndex(j => j === start.slice(0,5));
        const endIdx = slotJam1Jam.findIndex(j => j === end.slice(0,5));
        if (startIdx === -1 || endIdx === -1) return [];
        return Array.from({length: endIdx - startIdx}, (_, i) => startIdx + i);
      });
    // Tambahkan slot yang dibooking user lain (pending/berhasil, belum expired)
    allOrders.forEach(o => {
      // Pastikan mingguKe dan ruangan bertipe number
      const orderMingguKe = typeof o.mingguKe === 'string' ? parseInt(o.mingguKe) : o.mingguKe;
      const orderRuangan = typeof o.ruangan === 'string' ? parseInt(o.ruangan) : o.ruangan;
      if (
        o.hari === hari &&
        orderMingguKe === mingguKe + 1 && // mingguKe di order 1-based, di state 0-based
        orderRuangan === Number(ruangan) &&
        (o.status === 'pending' ? (o.expireAt && now < o.expireAt) : o.status === 'berhasil')
      ) {
        // Mark semua slot jam yang dibooking
        const idxStart = slotJam1Jam.indexOf(o.jamMulai);
        const idxEnd = slotJam1Jam.indexOf(o.jamAkhir);
        if (idxStart !== -1 && idxEnd !== -1) {
          for (let i = idxStart; i < idxEnd; i++) {
            bookedIdx.push(i);
          }
        }
      }
    });
    // Unikkan index
    return [...new Set(bookedIdx)];
  };

  // Reset jam jika ganti hari/minggu
  const handleDayClick = (hari, tutup) => {
    if (tutup) return;
    if (!hasOpened) setHasOpened(true);
    if (selectedDay === hari) {
      setRipple(false);
      setTimeout(() => setRipple(true), 10); // trigger ulang animasi
    } else {
      setRipple(false);
      setSelectedDay(hari);
      setTimeout(() => setRipple(true), 10);
    }
    setSelectedDay(hari);
  };

  // Helper untuk dapatkan tanggal terdekat hari yang dipilih (tanpa batas maksimal hari)
  const getTanggalPilihan = (hari) => {
    if (!hari) return [null];
    const hariMap = {
      'Minggu': 0, 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6
    };
    const now = new Date();
    now.setHours(0,0,0,0);
    const selisih = (hariMap[hari] - now.getDay() + 7) % 7;
    const tgl = new Date(now);
    tgl.setDate(now.getDate() + selisih);
    return [tgl];
  };

  // Helper untuk dapatkan tanggal-tanggal 7 hari pada minggu ke-n
  const getTanggalMinggu = (n) => {
    const now = new Date();
    now.setHours(0,0,0,0);
    // Cari hari Senin minggu ini (Senin = 1, Minggu = 0)
    const hariIni = now.getDay();
    // Senin = 1, jika hari Minggu (0), maka mundur 6 hari, selain itu mundur (hariIni-1)
    const selisihSenin = hariIni === 0 ? -6 : 1 - hariIni;
    const hariSenin = new Date(now);
    hariSenin.setDate(now.getDate() + selisihSenin + n * 7);
    // Patch: perhitungan setDate di JS bisa menyebabkan bug timezone (misal, jam 00:00 tapi offset UTC+7, hasilnya bisa mundur 1 hari)
    // Solusi: gunakan setUTCDate dan setUTCHours agar tidak terpengaruh offset lokal
    hariSenin.setUTCHours(0,0,0,0);
    // Kembalikan array 7 tanggal (Senin s/d Minggu)
    return Array.from({length: 7}, (_, i) => {
      const tgl = new Date(hariSenin);
      tgl.setUTCDate(hariSenin.getUTCDate() + i);
      return tgl;
    });
  };

  // Hitung total jam booking berdasarkan kotak yang dipilih
  let totalJam = 0;
  if (idxMulai !== null && idxAkhir !== null && idxAkhir > idxMulai) {
    // Setiap slot 1 jam (misal: 09:30, 10:30, dst), selisih index = jumlah jam
    totalJam = idxAkhir - idxMulai;
  }

  // Data info ruangan
  const infoRuangan = {
    1: {
      fasilitas: ['AC', 'Drum Set', 'Gitar & Bass', 'Mic', 'Speaker', 'Kursi Musisi'],
      aturan: ['Dilarang merokok', 'Jaga kebersihan', 'Tidak membawa makanan/minuman ke dalam ruangan', 'Tidak merusak alat'],
    },
    2: {
      fasilitas: ['AC', 'Keyboard', 'Drum Elektrik', 'Mic', 'Speaker', 'Kursi Musisi'],
      aturan: ['Dilarang merokok', 'Jaga kebersihan', 'Tidak membawa makanan/minuman ke dalam ruangan', 'Tidak merusak alat'],
    },
  };
  const [showInfo, setShowInfo] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);

  // Prefill state dari query string jika ada
  useEffect(() => {
    if (!nextSearchParams) return;
    const hari = nextSearchParams.get('hari');
    const mingguKeQ = nextSearchParams.get('mingguKe');
    const jamMulaiQ = nextSearchParams.get('jamMulai');
    const jamAkhirQ = nextSearchParams.get('jamAkhir');
    const ruanganQ = nextSearchParams.get('ruangan');
    if (hari && mingguKeQ && jamMulaiQ && jamAkhirQ && ruanganQ) {
      setSelectedDay(hari);
      setMingguKe(Number(mingguKeQ));
      setIdxMulai(slotJam1Jam.indexOf(jamMulaiQ));
      setIdxAkhir(slotJam1Jam.indexOf(jamAkhirQ));
      setSelectedRoom(Number(ruanganQ));
      setHasOpened(true);
    }
  }, [nextSearchParams]);

  // Cek login
  function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }


  return (
    <div className="fixed inset-0 flex items-center justify-end z-0 pr-[10vw]" style={{minHeight: '100vh'}}>
      {/* ...existing code... */}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingClient />
    </Suspense>
  );
}
