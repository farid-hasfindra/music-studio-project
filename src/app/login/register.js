import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage('Password dan konfirmasi tidak sama');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', { // Perbaiki di sini
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registrasi berhasil! Mengarahkan ke login...');
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage('Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form className="space-y-4" onSubmit={handleRegister}>
        <input className="w-full border p-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Konfirmasi Password" value={confirm} onChange={e => setConfirm(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Register</button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}