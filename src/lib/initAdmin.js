import { connectDB } from './mongodb'
import User from '@/models/User'
import bcrypt from 'bcrypt'

export async function createDefaultAdmin() {
  await connectDB()

  const adminEmail = 'admin@gmail.com'
  const existing = await User.findOne({ email: adminEmail })

  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await User.create({
      name: 'Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    })
    console.log('✅ Akun admin berhasil dibuat.')
  } else {
    console.log('ℹ️ Akun admin sudah ada.')
  }
}