import dotenv from 'dotenv'
import path from 'path'

// In production (Cloud Run), environment variables are injected directly
// Only load .env files in development/test environments
if (process.env.NODE_ENV !== 'production') {
  const envFile = process.env.NODE_ENV === 'test' ? '.env.local' : '.env.local'
  dotenv.config({ path: path.resolve(process.cwd(), envFile) })
}

const PORT = process.env.PORT
const HOST = process.env.HOST || 'localhost'

const MONGODB_URI =
  process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

const JWT_SECRET = process.env.JWT_SECRET || 'my_secret'
const MONGODB_DBNAME =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_DBNAME
    : process.env.MONGODB_DBNAME || 'prod'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173'

export default { PORT, MONGODB_URI, HOST, JWT_SECRET, MONGODB_DBNAME, FRONTEND_URL, CORS_ORIGINS }
