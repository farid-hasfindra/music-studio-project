// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '../mongodb'
import User from '../userModel'

export async function POST(req) {
  try {
    const { username, email, password } = await req.json()
    if (!username || !email || !password) {
      return NextResponse.json({ message: 'Semua field wajib diisi' }, { status: 400 })
    }
    await connectDB()
    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) {
      return NextResponse.json({ message: 'Email atau username sudah terdaftar' }, { status: 400 })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ username, email, password: hashed })
    return NextResponse.json({ message: 'Registrasi berhasil!' }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
