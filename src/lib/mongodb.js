import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI belum diatur di .env.local')
}

let cached = global.mongoose || { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'bookingstudio',
      bufferCommands: false,
    })
      .then((mongooseInstance) => {
        console.log('Connected to MongoDB Atlas')
        return mongooseInstance
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err)
        throw err
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}
