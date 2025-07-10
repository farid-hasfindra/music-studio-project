// src/app/api/auth/login/route.js
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function POST(req) {
  const { email, password } = await req.json()
  await connectDB()

  const user = await User.findOne({ email })
  if (!user) return Response.json({ message: 'User tidak ditemukan' }, { status: 404 })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return Response.json({ message: 'Password salah' }, { status: 401 })

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  return Response.json({ message: 'Login berhasil', token })
}
