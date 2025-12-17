import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  } else {
    // Production
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    } else {
      // Programming or unknown error
      console.error('ERROR 💥', err)
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      })
    }
  }
}

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404)
  next(error)
}
