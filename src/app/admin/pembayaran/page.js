"use client";
import { useState } from "react";

export default function AdminPembayaran() {
  // Data dummy rekening, nanti bisa dihubungkan ke backend
  const [rekening, setRekening] = useState([
    { id: 1, bank: "BCA", nomor: "1234567890", nama: "Resty Music Studio" },
    { id: 2, bank: "Mandiri", nomor: "9876543210", nama: "Resty Music Studio" },
  ]);
  const [newBank, setNewBank] = useState("");
  const [newNomor, setNewNomor] = useState("");
  const [newNama, setNewNama] = useState("");

  const handleAdd = () => {
    if (!newBank.trim() || !newNomor.trim() || !newNama.trim()) return;
    setRekening([...rekening, { id: Date.now(), bank: newBank.trim(), nomor: newNomor.trim(), nama: newNama.trim() }]);
    setNewBank(""); setNewNomor(""); setNewNama("");
  };
  const handleDelete = (id) => setRekening(rekening.filter(r => r.id !== id));
  const handleEdit = (id, field, value) => setRekening(rekening.map(r => r.id === id ? { ...r, [field]: value } : r));

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Kelola Rekening Pembayaran</h2>
      <div className="mb-6">
        <label className="block font-semibold mb-2">Tambah Rekening Baru</label>
        <div className="flex gap-2 flex-wrap">
          <input type="text" className="border rounded px-2 py-1" placeholder="Bank" value={newBank} onChange={e => setNewBank(e.target.value)} />
          <input type="text" className="border rounded px-2 py-1" placeholder="No Rekening" value={newNomor} onChange={e => setNewNomor(e.target.value)} />
          <input type="text" className="border rounded px-2 py-1" placeholder="Nama Pemilik" value={newNama} onChange={e => setNewNama(e.target.value)} />
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Tambah</button>
        </div>
      </div>
      <div className="grid gap-4">
        {rekening.map(r => (
          <div key={r.id} className="bg-gray-900 text-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="font-semibold">{r.bank}</div>
              <div className="text-sm">No: <input className="bg-transparent border-b border-gray-600 w-32" value={r.nomor} onChange={e => handleEdit(r.id, 'nomor', e.target.value)} /></div>
              <div className="text-sm">a.n. <input className="bg-transparent border-b border-gray-600 w-40" value={r.nama} onChange={e => handleEdit(r.id, 'nama', e.target.value)} /></div>
            </div>
            <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600 text-sm">Hapus</button>
          </div>
        ))}
        {rekening.length === 0 && <div className="text-center text-gray-400">Belum ada rekening pembayaran.</div>}
      </div>
    </div>
  );
}
