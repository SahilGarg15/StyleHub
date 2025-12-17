import { Router } from 'express'
import { body } from 'express-validator'
import * as authController from '../controllers/authController'
import { protect } from '../middleware/auth'

const router = Router()

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required')
  ],
  authController.register
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  authController.login
)

router.get('/me', protect, authController.getMe)

router.post(
  '/verify-email',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ],
  authController.verifyEmail
)

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please provide a valid email')],
  authController.forgotPassword
)

router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  authController.resetPassword
)

export default router
