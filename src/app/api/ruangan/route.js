import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

// --- Mongoose Model ---
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

// --- API Handler ---
export async function GET() {
  await connectDB()
  const data = await Ruangan.find()
  return NextResponse.json(data)
}

export async function POST(req) {
  await connectDB()
  const body = await req.json()
  const ruangan = new Ruangan({ name: body.name, fasilitas: body.fasilitas || [] })
  await ruangan.save()
  return NextResponse.json(ruangan)
}

export async function DELETE(req) {
  await connectDB()
  const { id } = await req.json()
  await Ruangan.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
