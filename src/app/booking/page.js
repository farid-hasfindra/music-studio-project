export default function BookingPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Booking Studio</h2>
      <form className="space-y-4">
        <input className="w-full border p-2" type="date" />
        <select className="w-full border p-2">
          <option>Pilih Jam</option>
          <option>10:00 - 12:00</option>
          <option>12:00 - 14:00</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Booking Sekarang</button>
      </form>
    </div>
  )
}
