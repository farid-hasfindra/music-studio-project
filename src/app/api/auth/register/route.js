// src/app/api/auth/register/route.js
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcrypt'

export async function POST(req) {
  const { name, email, password } = await req.json()
  await connectDB()

  const existing = await User.findOne({ email })
  if (existing) {
    return Response.json({ message: 'Email sudah digunakan' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({ name, email, password: hashedPassword })

  return Response.json({ message: 'Registrasi berhasil', user })
}
