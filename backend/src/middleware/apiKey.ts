import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'

// In production, store these in database
// For now, using environment variable
const VALID_API_KEYS = new Set([
  process.env.API_KEY || 'sk_test_stylehub_ai_integration_key_2024',
  'sk_live_stylehub_ai_key_production'
])

export interface ApiKeyRequest extends Request {
  apiKey?: string
}

export const validateApiKey = (req: ApiKeyRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string || req.query.api_key as string

  if (!apiKey) {
    return next(new AppError('API key is required. Provide it in X-API-Key header or api_key query parameter', 401))
  }

  if (!VALID_API_KEYS.has(apiKey)) {
    return next(new AppError('Invalid API key', 403))
  }

  req.apiKey = apiKey
  next()
}
