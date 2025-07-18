
"use client"
import { useState } from "react"

export default function AdminFasilitas() {
  // Data dummy ruangan dan fasilitas
  const [rooms, setRooms] = useState([
    { id: 1, name: "Ruang 1", fasilitas: ["Drum", "Gitar", "AC"] },
    { id: 2, name: "Ruang 2", fasilitas: ["Keyboard", "Bass", "AC"] },
  ])
  const [newRoom, setNewRoom] = useState("")
  const [newFasilitas, setNewFasilitas] = useState({})

  // Tambah ruangan
  const handleAddRoom = () => {
    if (!newRoom.trim()) return
    setRooms([...rooms, { id: Date.now(), name: newRoom.trim(), fasilitas: [] }])
    setNewRoom("")
  }

  // Hapus ruangan
  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter(r => r.id !== id))
  }

  // Tambah fasilitas ke ruangan
  const handleAddFasilitas = (roomId) => {
    const nama = (newFasilitas[roomId] || "").trim()
    if (!nama) return
    setRooms(rooms.map(r => r.id === roomId ? { ...r, fasilitas: [...r.fasilitas, nama] } : r))
    setNewFasilitas({ ...newFasilitas, [roomId]: "" })
  }

  // Hapus fasilitas dari ruangan
  const handleDeleteFasilitas = (roomId, idx) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, fasilitas: r.fasilitas.filter((_, i) => i !== idx) } : r))
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Kelola Fasilitas & Ruangan Studio</h2>
      <div className="mb-6">
        <label className="block font-semibold mb-2">Tambah Ruangan Baru</label>
        <div className="flex gap-2">
          <input type="text" className="border rounded px-2 py-1 flex-1" placeholder="Nama Ruangan" value={newRoom} onChange={e => setNewRoom(e.target.value)} />
          <button onClick={handleAddRoom} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Tambah</button>
        </div>
      </div>
      <div className="grid gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-gray-900 text-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-lg">{room.name}</div>
              <button onClick={() => handleDeleteRoom(room.id)} className="text-red-400 hover:text-red-600 text-sm">Hapus Ruangan</button>
            </div>
            <div className="mb-2">
              <div className="font-semibold mb-1">Fasilitas:</div>
              <ul className="list-disc ml-6 mb-2">
                {room.fasilitas.map((f, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>{f}</span>
                    <button onClick={() => handleDeleteFasilitas(room.id, idx)} className="text-xs text-red-300 hover:text-red-500 ml-2">Hapus</button>
                  </li>
                ))}
                {room.fasilitas.length === 0 && <li className="text-gray-400 italic">Belum ada fasilitas</li>}
              </ul>
              <div className="flex gap-2 mt-2">
                <input type="text" className="border rounded px-2 py-1 flex-1 text-black" placeholder="Tambah fasilitas" value={newFasilitas[room.id] || ""} onChange={e => setNewFasilitas({ ...newFasilitas, [room.id]: e.target.value })} />
                <button onClick={() => handleAddFasilitas(room.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Tambah</button>
              </div>
            </div>
          </div>
        ))}
        {rooms.length === 0 && <div className="text-center text-gray-400">Belum ada ruangan tersedia.</div>}
      </div>
    </div>
  )
}
