// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ message: 'Email dan password wajib diisi' }, { status: 400 })
    }
    await connectDB()
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: 'Email tidak ditemukan' }, { status: 400 })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ message: 'Password salah' }, { status: 400 })
    }
    const token = jwt.sign(
      { username: user.username, email: user.email, id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    return NextResponse.json({ token }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
