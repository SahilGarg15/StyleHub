import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import { AppError } from '../utils/errors'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export const protect = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    let token: string | undefined

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies?.token) {
      // Check for token in cookies
      token = req.cookies.token
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to access this resource.', 401))
    }

    // Verify token
    const decoded = verifyToken(token)
    req.user = decoded

    next()
  } catch (error) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401))
  }
}

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403))
    }
    next()
  }
}
