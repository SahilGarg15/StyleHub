import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  // Always log the error for debugging
  console.error('ERROR 💥:', {
    message: err.message,
    statusCode: err.statusCode,
    isOperational: err.isOperational,
    stack: err.stack
  })

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  } else {
    // Production - but still provide useful error messages
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    } else {
      // Log programming or unknown errors but send sanitized message
      res.status(500).json({
        status: 'error',
        message: err.message || 'Something went wrong!',
        ...(process.env.NODE_ENV !== 'production' && { error: err.toString() })
      })
    }
  }
}

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404)
  next(error)
}
