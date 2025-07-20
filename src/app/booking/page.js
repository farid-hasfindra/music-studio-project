
"use client";
// Hindari hydration mismatch: render tanggal hanya di client

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function BookingClient() {
  // Handler klik hari booking
  function handleDayClick(hari, isDisabled) {
    if (isDisabled) return;
    setSelectedDay(hari);
    setIdxMulai(null);
    setIdxAkhir(null);
    setSelectedRoom(null);
  }
  // Fungsi untuk cek apakah minggu ke-X ada hari aktif (tidak tutup dan belum lewat)
  function getTanggalMinggu(mingguKe) {
    // Asumsi mingguKe=0 adalah minggu berjalan, dst
    const now = new Date();
    const hariIni = now.getDay(); // 0=minggu, 1=senin, dst
    // Cari tanggal senin minggu ke-X
    const senin = new Date(now);
    senin.setDate(now.getDate() - ((hariIni + 6) % 7) + mingguKe * 7);
    senin.setHours(0,0,0,0);
    // Kembalikan array 7 tanggal (senin-minggu)
    return Array.from({length:7}, (_,i)=>{
      const d = new Date(senin);
      d.setDate(senin.getDate()+i);
      return d;
    });
  }

  function isMingguAdaHariAktif(mk) {
    const tanggalMinggu = getTanggalMinggu(mk);
    return jadwal.some((j, idx) => {
      const tgl = tanggalMinggu[idx];
      return !j.tutup && tgl >= new Date(new Date().setHours(0,0,0,0));
    });
  }
  // Hindari hydration mismatch: render tanggal hanya di client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
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
  const [mingguKe, setMingguKe] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [idxMulai, setIdxMulai] = useState(null);
  const [idxAkhir, setIdxAkhir] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(null);
  const nextSearchParams = useSearchParams();

  // Slot jam per 1 jam (09.30–23.00)
  const slotJam1Jam = [
    '09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30', '20:30', '21:30', '22:30', '23:00'
  ];
  // const [jamError, setJamError] = useState(null); // index yang error

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
        {/* Tombol kembali (icon) */}
        <AnimatePresence mode="wait">
        {selectedDay && (
          <>
            <motion.button
              key="back-btn"
              initial={{ x: 0, opacity: 0, scale: 0.7 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -40, opacity: 0, scale: 0.5, transition: { duration: 0.4, type: 'spring', bounce: 0.5 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => setSelectedDay(null)}
              aria-label="Kembali ke Jadwal Booking"
              className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-30 mr-2 mt-8"
              style={{ alignSelf: 'flex-start' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </motion.button>
            <motion.div
              key="booking-studio"
              initial={{ x: 80, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ scale: 0.5, opacity: 0, x: 80, transition: { duration: 0.7, type: 'spring', bounce: 0.6 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="z-20"
              style={{ width: 340, maxWidth: '100%' }}
            >
              <div className="bg-gray-900 rounded-xl p-8 shadow-lg w-full">
                <h2 className="text-xl font-bold mb-4 text-blue-400 text-center">Booking Studio - {selectedDay}</h2>
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
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-lg mt-4 disabled:opacity-50"
                  disabled={!(selectedDay && idxMulai !== null && idxAkhir !== null && idxAkhir > idxMulai && selectedRoom !== null)}
                  onClick={() => {
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
            </motion.div>
          </>
        )}
        </AnimatePresence>
    const tanggalMinggu = getTanggalMinggu(mingguKe);
    return jadwal.some((j, idx) => {
      const tgl = tanggalMinggu[idx];
      return !j.tutup && tgl >= new Date(new Date().setHours(0,0,0,0));
    });
  };

  // Saat mount, jika mingguKe sekarang tidak ada hari aktif, auto ke minggu berikutnya
  useEffect(() => {
    let mk = 0;
    while (!isMingguAdaHariAktif(mk)) {
      mk++;
    }
    if (mk !== mingguKe) setMingguKe(mk);
    // eslint-disable-next-line
  }, []);

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
    <div className="flex items-center justify-center min-h-screen bg-black px-2">
      <div className="flex flex-row items-start justify-center w-full max-w-4xl gap-6" style={{minHeight:'500px'}}>
        {/* Jadwal Booking */}
        <motion.div
          key="jadwal-booking"
          animate={selectedDay ? { x: 0, opacity: 1, scale: 0.97, filter: 'blur(0.5px)' } : { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ type: 'tween', ease: [0.4,0,0.2,1], duration: 0.6 }}
          className="z-10"
          style={{ width: 340, maxWidth: '100%' }}
        >
          <div className="bg-gray-900 rounded-xl p-8 shadow-lg w-full">
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
                // Render tanggal hanya di client
                let tglStr = '';
                let isDisabled = j.tutup;
                if (isClient) {
                  const tgl = getTanggalMinggu(mingguKe)[idx];
                  tglStr = tgl ? tgl.toLocaleDateString('id-ID') : '';
                  isDisabled = j.tutup || (tgl && tgl < new Date(new Date().setHours(0,0,0,0)));
                }
                return (
                  <button
                    key={j.hari}
                    className={`rounded-lg px-3 py-2 text-sm font-bold transition-all ${selectedDay === j.hari ? 'bg-blue-600 text-white' : isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-800 text-gray-300' : 'bg-gray-800 text-gray-300 hover:bg-blue-800'}`}
                    onClick={() => handleDayClick(j.hari, isDisabled)}
                    disabled={isDisabled}
                  >
                    <div>{j.hari}</div>
                    <div className="text-xs font-normal">{j.jam}</div>
                    <div className="text-xs font-normal">{isClient ? tglStr : <span className="invisible">0000-00-00</span>}</div>
                    {isDisabled && <div className="text-xs text-gray-500">{j.tutup ? 'Tutup' : 'Sudah Lewat'}</div>}
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">Klik hari untuk booking studio</div>
          </div>
        </motion.div>
        {/* Booking Studio */}
        <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div
            key="booking-studio"
            initial={{ x: 80, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ scale: [1, 1.15, 0.7, 1.2, 0.5], opacity: [1, 0.7, 0.5, 0.2, 0], x: 80, transition: { duration: 0.7, type: 'spring', bounce: 0.6 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="z-20"
            style={{ width: 340, maxWidth: '100%' }}
          >
            <div className="bg-gray-900 rounded-xl p-8 shadow-lg w-full">
              <h2 className="text-xl font-bold mb-4 text-blue-400 text-center">Booking Studio - {selectedDay}</h2>
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
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-lg mt-4 disabled:opacity-50"
                disabled={!(selectedDay && idxMulai !== null && idxAkhir !== null && idxAkhir > idxMulai && selectedRoom !== null)}
                onClick={() => {
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
              <button className="mt-4 text-xs text-blue-400 underline w-full" onClick={()=>setSelectedDay(null)}>
                &larr; Kembali ke Jadwal Booking
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
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
