'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function BookingPage() {
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

  // Dapatkan slot yang sudah dibooking (per jam) untuk hari & mingguKe terpilih
  const getSlotBooked = (hari, mingguKe) => {
    return bookings
      .filter(b => b.hari === hari && b.mingguKe === mingguKe)
      .map(b => b.slot)
      .flatMap(slot => {
        // slot: '09:30 - 11:30' => ['09:30', '10:30', '11:30']
        // Untuk 1 jam, kita mapping ke jam awal hingga sebelum jam akhir
        const [start, end] = slot.split(' - ');
        const startIdx = slotJam1Jam.findIndex(j => j === start.slice(0,5));
        const endIdx = slotJam1Jam.findIndex(j => j === end.slice(0,5));
        if (startIdx === -1 || endIdx === -1) return [];
        // Booking slot jam: [startIdx, endIdx)
        return Array.from({length: endIdx - startIdx}, (_, i) => startIdx + i);
      });
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
    // Set state hanya jika semua data ada (agar langsung buka form booking, bukan hanya jadwal)
    if (hari && mingguKeQ && jamMulaiQ && jamAkhirQ && ruanganQ) {
      setSelectedDay(hari);
      setMingguKe(Number(mingguKeQ));
      setIdxMulai(slotJam1Jam.indexOf(jamMulaiQ));
      setIdxAkhir(slotJam1Jam.indexOf(jamAkhirQ));
      setSelectedRoom(Number(ruanganQ));
      setHasOpened(true); // agar langsung buka form booking
    }
  }, [nextSearchParams]);

  // Cek login
  function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  return (
    <div className="fixed inset-0 flex items-center justify-end z-0 pr-[10vw]" style={{minHeight: '100vh'}}>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-5xl">
        {/* Jadwal Booking */}
        <div
          className={`bg-gray-900 rounded-xl p-6 shadow text-white max-w-md w-full flex flex-col items-center
          transition-all duration-700 ease-in-out
          ${selectedDay ? 'md:translate-x-[-30%] md:opacity-80' : 'md:translate-x-0 opacity-100'}`}
          style={{
            zIndex: selectedDay ? 1 : 10,
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Jadwal Booking</h2>
          {/* Fitur sortir minggu: 1 tombol dengan panah naik/turun */}
          <div className="flex justify-end w-full mb-2">
            <div className="flex items-center gap-1 bg-gray-800 rounded px-2 py-1 border border-gray-700">
              <span className="text-xs text-white font-semibold px-2">Minggu ke-{mingguKe+1}</span>
              <button
                className="text-white px-1 disabled:opacity-40"
                onClick={() => setMingguKe(Math.max(0, mingguKe-1))}
                disabled={mingguKe === 0}
                title="Minggu sebelumnya"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 9l-6 6-6-6"/></svg>
              </button>
              <button
                className="text-white px-1 disabled:opacity-40"
                onClick={() => setMingguKe(Math.min(3, mingguKe+1))}
                disabled={mingguKe === 3}
                title="Minggu berikutnya"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 15l6-6 6 6"/></svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            {jadwal.map((j, idx) => {
              const tanggalMinggu = getTanggalMinggu(mingguKe);
              const hariMap = {
                'Minggu': 0, 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6
              };
              const tgl = tanggalMinggu[hariMap[j.hari]];
              const now = new Date();
              now.setHours(0,0,0,0);
              // Cek jika hari memang tutup (jadwal Minggu) atau tanggal sudah lewat
              const isSudahLewat = tgl < now;
              const isTutup = j.tutup;
              return (
                <button
                  key={j.hari}
                  disabled={isTutup || isSudahLewat}
                  onClick={() => handleDayClick(j.hari, isTutup || isSudahLewat)}
                  className={`py-1.5 px-3 rounded-lg font-semibold text-center transition-all flex flex-col items-center h-16
                    ${(isTutup || isSudahLewat) ? 'bg-gray-700 text-gray-400 cursor-not-allowed' :
                      (selectedDay === j.hari ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-blue-700 text-white')}`}
                >
                  <span className="text-base flex items-center gap-1">
                    {j.hari}
                    {!isTutup && !isSudahLewat && <span className="text-xs text-gray-300">({j.jam})</span>}
                  </span>
                  {isTutup ? (
                    <span className="text-xs text-gray-400 mt-1">Tutup</span>
                  ) : isSudahLewat ? (
                    <span className="text-xs text-gray-400 mt-1">Sudah Lewat</span>
                  ) : (
                    <span className="text-xs text-gray-400 mt-1">{tgl.getDate()}-{tgl.getMonth()+1}-{tgl.getFullYear()}</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-gray-400 text-sm">Klik hari untuk booking studio</div>
        </div>

        {/* Booking Studio */}
        <div
          ref={bookingStudioRef}
          className={`bg-gray-900 rounded-xl p-6 shadow text-white max-w-md w-full
          transition-all duration-500 ease-[cubic-bezier(.77,0,.18,1)]
          ${selectedDay ? 'opacity-100 scale-100 translate-x-0 z-10' : 'opacity-0 scale-95 translate-x-10 pointer-events-none z-0'}
          ${selectedDay && !ripple && hasOpened ? 'animate-bounce-in-smooth' : ''}
          ${ripple ? 'animate-water-ripple' : ''}`}
          style={{
            marginLeft: selectedDay ? '32px' : '0',
            position: 'relative',
          }}
        >
          {/* Overlay untuk blokir interaksi Booking Studio saat modal info ruangan tampil */}
          {showInfo && (
            <div className="absolute inset-0 z-40 bg-transparent pointer-events-auto" />
          )}
          {selectedDay && (
            <>
              {/* Tombol kembali di tengah kiri */}
              <button
                onClick={() => { setSelectedDay(null); setIdxMulai(null); setIdxAkhir(null); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-md border border-gray-700 z-20 flex items-center justify-center"
                style={{ width: 32, height: 32, marginLeft: '-20px' }}
                aria-label="Kembali"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl font-bold mb-4">Booking Studio - {selectedDay}</h2>
                {/* Pilihan jam booking mulai dan hingga, hanya slot kosong */}
                <form className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {slotJam1Jam.map((jam, idx) => {
                      const bookedIdx = getSlotBooked(selectedDay, mingguKe);
                      const isBooked = bookedIdx.includes(idx);
                      const isSelected = idxMulai !== null && idxAkhir === null && idx === idxMulai;
                      const isInRange = idxMulai !== null && idxAkhir !== null && idx >= idxMulai && idx <= idxAkhir;
                      const isError = jamError === idx;
                      let status = '';
                      if (isBooked) status = 'booked';
                      else if (isError) status = 'error';
                      else if (isInRange) status = 'range';
                      else if (isSelected) status = 'selected';
                      return (
                        <button
                          key={jam}
                          type="button"
                          disabled={isBooked}
                          className={`w-14 h-10 rounded-md font-bold text-sm border transition-all
                            ${isBooked ? 'bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed' :
                              isError ? 'bg-red-600 text-white border-red-700 animate-pulse' :
                              isInRange ? 'bg-blue-500 text-white border-blue-700' :
                              isSelected ? 'bg-blue-700 text-white border-blue-900' :
                              'bg-gray-800 text-white border-gray-600 hover:bg-blue-800'}
                          `}
                          onClick={() => {
                            setJamError(null);
                            // Jika klik ulang pada jam yang sama (mulai/akhir), reset
                            if ((idxMulai === idx && idxAkhir === null) || (idxAkhir === idx)) {
                              setIdxMulai(null); setIdxAkhir(null); return;
                            }
                            // Pilih jam mulai
                            if (idxMulai === null) {
                              if (isBooked) return;
                              setIdxMulai(idx); setIdxAkhir(null);
                            } else if (idxAkhir === null) {
                              // Pilih jam akhir
                              if (idx <= idxMulai) {
                                setJamError(idx); setTimeout(()=>setJamError(null), 1000); return;
                              }
                              // Cek jika ada slot booked di tengah range
                              const bookedIdx = getSlotBooked(selectedDay, mingguKe);
                              const adaBooked = bookedIdx.some(i => i > idxMulai && i <= idx);
                              if (adaBooked) {
                                // Highlight slot yang booked di tengah
                                setJamError(bookedIdx.find(i => i > idxMulai && i <= idx));
                                setTimeout(()=>setJamError(null), 1000);
                                return;
                              }
                              setIdxAkhir(idx);
                            } else {
                              // Sudah pilih range, klik apapun reset
                              setIdxMulai(null); setIdxAkhir(null);
                            }
                          }}
                        >
                          {jam}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-sm text-gray-300 font-semibold">
                    Total durasi booking: {totalJam} jam
                  </div>
                  {/* Pilihan ruangan */}
                  <div className="mt-4">
                    <div className="text-gray-200 font-semibold mb-2">Pilih Ruangan:</div>
                    <div className="flex gap-4">
                      {[1,2].map(n => (
                        <div key={n} className="flex flex-col items-center">
                          <label className={`flex flex-col items-center cursor-pointer rounded-lg border-2 transition-all
                            ${selectedRoom === n ? 'border-blue-500 bg-gray-800' : 'border-gray-700 bg-gray-900 hover:border-blue-400'}`}
                            style={{width: 120, padding: 8}}>
                            <input
                              type="radio"
                              name="ruangan"
                              value={n}
                              checked={selectedRoom === n}
                              onChange={() => setSelectedRoom(n)}
                              className="hidden"
                            />
                            <img
                              src={`/ruang${n}.jpg`}
                              alt={`Ruang ${n}`}
                              className="w-20 h-16 object-cover rounded mb-2 border border-gray-700"
                            />
                            <span className="text-white font-semibold">Ruang {n}</span>
                          </label>
                          <button
                            type="button"
                            className="mt-1 text-xs px-2 py-1 rounded bg-gray-700 text-gray-200 border border-gray-600 hover:bg-blue-700 hover:text-white transition-all"
                            onClick={() => { setShowInfo(n); setTimeout(()=>setInfoVisible(true), 10); }}
                          >
                            Info
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Komponen Info Ruangan Modal */}
                  {showInfo && (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center transition-all ${infoVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    style={{backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.35)'}}
    onClick={() => {
      setInfoVisible(false);
      setTimeout(() => setShowInfo(null), 350);
    }}
  >
    <div
      className={`relative bg-gray-900 rounded-xl p-6 w-full max-w-xs shadow-lg border-2 border-blue-400 pointer-events-auto
        ${infoVisible ? 'animate-pop-in-cute' : 'animate-pop-out-cute'}`}
      style={{minWidth: 300, minHeight: 220}}
      onClick={e => e.stopPropagation()}
    >
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-xl font-bold z-10"
        onClick={e => {
          e.stopPropagation();
          setInfoVisible(false);
          setTimeout(() => setShowInfo(null), 350);
        }}
        aria-label="Tutup"
      >
        ×
      </button>
      <div className="text-lg font-bold text-blue-300 mb-2 text-center">Info Ruang {showInfo}</div>
      <div className="font-bold mb-1">Fasilitas:</div>
      <ul className="list-disc ml-4 mb-2">
        {infoRuangan[showInfo].fasilitas.map(f => <li key={f}>{f}</li>)}
      </ul>
      <div className="font-bold mb-1">Aturan:</div>
      <ul className="list-disc ml-4">
        {infoRuangan[showInfo].aturan.map(a => <li key={a}>{a}</li>)}
      </ul>
    </div>
  </div>
)}
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-lg disabled:opacity-40 mt-2"
                    disabled={idxMulai === null || idxAkhir === null || !selectedRoom}
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams({
                        hari: selectedDay,
                        mingguKe: mingguKe.toString(),
                        jamMulai: idxMulai !== null ? slotJam1Jam[idxMulai] : '',
                        jamAkhir: idxAkhir !== null ? slotJam1Jam[idxAkhir] : '',
                        totalJam: totalJam.toString(),
                        ruangan: selectedRoom?.toString() || ''
                      });
                      if (!isLoggedIn()) {
                        // Simpan pesan popup ke sessionStorage
                        sessionStorage.setItem('popupBooking', 'Silahkan Login dulu sebelum Booking ya :)');
                        window.location.href = `/login?redirectTo=/booking?${params.toString()}`;
                        return;
                      }
                      window.location.href = `/pembayaran?${params.toString()}`;
                    }}
                  >
                    Konfirmasi Pesanan
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
        <style jsx>{`
          @keyframes bounce-in-smooth {
            0% { opacity: 0; transform: scale(0.95) translateX(40px); }
            60% { opacity: 1; transform: scale(1.03) translateX(-8px); }
            80% { transform: scale(0.98) translateX(2px); }
            100% { opacity: 1; transform: scale(1) translateX(0); }
          }
          .animate-bounce-in-smooth {
            animation: bounce-in-smooth 0.6s cubic-bezier(.77,0,.18,1) both;
          }
          @keyframes water-ripple {
            0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.15), 0 0 0 0 rgba(59,130,246,0.10); }
            40% { box-shadow: 0 0 0 8px rgba(59,130,246,0.10), 0 0 0 16px rgba(59,130,246,0.05); }
            100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.0), 0 0 0 0 rgba(59,130,246,0.0); }
          }
          .animate-water-ripple {
            animation: water-ripple 0.5s cubic-bezier(.4,0,.2,1);
          }
          @keyframes pop-in-cute {
            0% { opacity: 0; transform: scale(0.7) rotate(-8deg); }
            60% { opacity: 1; transform: scale(1.08) rotate(4deg); }
            80% { transform: scale(0.96) rotate(-2deg); }
            100% { opacity: 1; transform: scale(1) rotate(0); }
          }
          @keyframes pop-out-cute {
            0% { opacity: 1; transform: scale(1) rotate(0); }
            40% { opacity: 1; transform: scale(1.08) rotate(-4deg); }
            100% { opacity: 0; transform: scale(0.7) rotate(8deg); }
          }
          .animate-pop-in-cute {
            animation: pop-in-cute 0.4s cubic-bezier(.77,0,.18,1) both;
          }
          .animate-pop-out-cute {
            animation: pop-out-cute 0.35s cubic-bezier(.77,0,.18,1) both;
          }
        `}</style>
      </div>
    </div>
  );
}
