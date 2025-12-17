import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from '../src/routes/authRoutes'
import productRoutes from '../src/routes/productRoutes'
import orderRoutes from '../src/routes/orderRoutes'
import reviewRoutes from '../src/routes/reviewRoutes'
import userRoutes from '../src/routes/userRoutes'

// Import middleware
import { errorHandler, notFound } from '../src/middleware/errorHandler'

const app: Application = express()

// CORS configuration - allow all origins for Vercel deployment
app.use(cors({
  origin: true,
  credentials: true
}))

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parser
app.use(cookieParser())

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'StyleHub API is running',
    timestamp: new Date().toISOString()
  })
})

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'StyleHub API is running',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/users', userRoutes)

// 404 handler
app.use(notFound)

// Global error handler
app.use(errorHandler)

// Export the Express app for Vercel serverless
export default app
