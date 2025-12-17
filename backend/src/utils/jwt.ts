import jwt from 'jsonwebtoken'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export const generateToken = (payload: JWTPayload): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN?.trim() || '7d'
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn
  })
}

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
}
