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
    <div className="flex flex-row items-center justify-center min-h-screen bg-black px-4 md:px-0">
      {/* Kiri: Jadwal Booking */}
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg w-full max-w-sm mr-8">
        <h2 className="text-xl font-bold mb-4 text-blue-400 text-center">Jadwal Booking</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Minggu ke-{mingguKe + 1}</span>
          <div className="relative">
            <button className="bg-gray-800 text-white px-2 py-1 rounded" onClick={() => setMingguKe(m => Math.max(0, m - 1))} disabled={mingguKe === 0}>&lt;</button>
            <button className="bg-gray-800 text-white px-2 py-1 rounded ml-2" onClick={() => setMingguKe(m => m + 1)}>&gt;</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {jadwal.map((j, idx) => {
            const tgl = getTanggalMinggu(mingguKe)[idx];
            const isSelected = selectedDay === j.hari;
            const isDisabled = j.tutup || (tgl && tgl < new Date(new Date().setHours(0,0,0,0)));
            return (
              <button
                key={j.hari}
                className={`rounded-lg px-3 py-2 text-sm font-bold transition-all ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
                onClick={() => handleDayClick(j.hari, isDisabled)}
                disabled={isDisabled}
              >
                <div>{j.hari}</div>
                <div className="text-xs font-normal">{j.jam}</div>
                <div className="text-xs font-normal">{tgl ? tgl.toLocaleDateString('id-ID') : ''}</div>
                {isDisabled && <div className="text-xs text-gray-500">{j.tutup ? 'Tutup' : 'Sudah Lewat'}</div>}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-gray-400 mt-2 text-center">Klik hari untuk booking studio</div>
      </div>

      {/* Kanan: Booking Studio */}
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-blue-400 text-center">Booking Studio{selectedDay ? ` - ${selectedDay}` : ''}</h2>
        {/* Slot jam */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {slotJam1Jam.map((jam, idx) => {
            const booked = selectedDay && selectedRoom !== null ? getSlotBooked(selectedDay, mingguKe, selectedRoom)?.includes(idx) : false;
            const isSelected = idxMulai !== null && idxAkhir !== null && idx >= idxMulai && idx < idxAkhir;
            return (
              <button
                key={jam}
                className={`rounded px-2 py-1 text-xs font-bold transition-all border ${isSelected ? 'bg-blue-600 text-white border-blue-400' : booked ? 'bg-gray-700 text-gray-500 border-gray-700 cursor-not-allowed' : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-blue-800'} ${booked ? 'opacity-50' : ''}`}
                disabled={booked || !selectedDay || selectedRoom === null}
                onClick={() => {
                  if (idxMulai === null || idx < idxMulai || idxAkhir !== null) {
                    setIdxMulai(idx);
                    setIdxAkhir(null);
                  } else if (idx > idxMulai) {
                    setIdxAkhir(idx);
                  }
                }}
              >{jam}</button>
            );
          })}
        </div>
        <div className="mb-4 text-sm">Total durasi booking: <span className="font-bold">{totalJam}</span> jam</div>
        {/* Pilih Ruangan */}
        <div className="mb-4">
          <div className="font-semibold mb-2">Pilih Ruangan:</div>
          <div className="flex gap-4">
            {[1,2].map(r => (
              <div key={r} className={`flex flex-col items-center border rounded-lg px-3 py-2 ${selectedRoom === r ? 'border-blue-400 bg-blue-900/30' : 'border-gray-700 bg-gray-800'}`}>
                <button
                  className={`font-bold mb-1 ${selectedRoom === r ? 'text-blue-400' : 'text-white'}`}
                  onClick={() => setSelectedRoom(r)}
                >Ruang {r}</button>
                <button className="text-xs bg-gray-700 text-gray-300 rounded px-2 py-1 mt-1" onClick={() => {setShowInfo(r);setInfoVisible(true);}}>Info</button>
              </div>
            ))}
          </div>
        </div>
        {/* Modal info ruangan */}
        {infoVisible && showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg max-w-xs w-full relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={()=>setInfoVisible(false)}>&times;</button>
              <h3 className="text-lg font-bold mb-2 text-blue-400">Fasilitas Ruang {showInfo}</h3>
              <ul className="mb-2 text-sm list-disc pl-5">
                {infoRuangan[showInfo].fasilitas.map(f => <li key={f}>{f}</li>)}
              </ul>
              <div className="font-semibold mb-1">Aturan:</div>
              <ul className="text-xs list-disc pl-5 text-gray-300">
                {infoRuangan[showInfo].aturan.map(a => <li key={a}>{a}</li>)}
              </ul>
            </div>
          </div>
        )}
        {/* Konfirmasi */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-lg mt-4 disabled:opacity-50"
          disabled={!(selectedDay && idxMulai !== null && idxAkhir !== null && idxAkhir > idxMulai && selectedRoom !== null)}
          onClick={() => {
            // Redirect ke pembayaran dengan query string
            const params = new URLSearchParams({
              hari: selectedDay,
              mingguKe: mingguKe.toString(),
              jamMulai: slotJam1Jam[idxMulai],
              jamAkhir: slotJam1Jam[idxAkhir],
              totalJam: totalJam.toString(),
              ruangan: selectedRoom.toString(),
            });
            window.location.href = `/pembayaran?${params.toString()}`;
          }}
        >
          Konfirmasi Pesanan
        </button>
      </div>
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
