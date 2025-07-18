import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

let Ruangan
try {
  Ruangan = mongoose.model('Ruangan')
} catch {
  const RuanganSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fasilitas: { type: [String], default: [] },
  })
  Ruangan = mongoose.model('Ruangan', RuanganSchema)
}

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI)
  }
}

// Tambah fasilitas ke ruangan
export async function POST(req, { params }) {
  await connectDB()
  const { fasilitas } = await req.json()
  const ruangan = await Ruangan.findById(params.id)
  if (!ruangan) return NextResponse.json({ error: 'Ruangan tidak ditemukan' }, { status: 404 })
  ruangan.fasilitas.push(fasilitas)
  await ruangan.save()
  return NextResponse.json(ruangan)
}

// Hapus fasilitas dari ruangan
export async function DELETE(req, { params }) {
  await connectDB()
  const { fasilitas } = await req.json()
  const ruangan = await Ruangan.findById(params.id)
  if (!ruangan) return NextResponse.json({ error: 'Ruangan tidak ditemukan' }, { status: 404 })
  ruangan.fasilitas = ruangan.fasilitas.filter(f => f !== fasilitas)
  await ruangan.save()
  return NextResponse.json(ruangan)
}
