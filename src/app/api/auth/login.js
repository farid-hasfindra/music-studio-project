import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const USERS_PATH = path.join(process.cwd(), 'src/app/api/auth/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    let users = [];
    try {
      const data = await fs.readFile(USERS_PATH, 'utf-8');
      users = JSON.parse(data);
    } catch {
      users = [];
    }
    const user = users.find(u => u.email === email);
    if (!user) {
      return new Response(JSON.stringify({ message: 'Email tidak ditemukan' }), { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ message: 'Password salah' }), { status: 401 });
    }
    // Pastikan username dan email ada!
    if (!user.username || !user.email) {
      return new Response(JSON.stringify({ message: 'Akun bermasalah, hubungi admin.' }), { status: 500 });
    }
    // Generate JWT dengan payload LENGKAP
    const payload = {
      username: user.username,
      email: user.email,
      // bisa tambahkan field lain jika ingin
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan server.' }), { status: 500 });
  }
}