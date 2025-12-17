import { Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { AuthRequest } from '../middleware/auth'
import { AppError, catchAsync } from '../utils/errors'
import { generateToken } from '../utils/jwt'
import { generateOTP } from '../utils/generators'

const prisma = new PrismaClient()

export const register = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, password, name, phone } = req.body

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return next(new AppError('Email already in use', 400))
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'USER'
    }
  })

  // Generate OTP for email verification
  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.oTPCode.create({
    data: {
      email: user.email,
      code: otp,
      purpose: 'EMAIL_VERIFICATION',
      expiresAt
    }
  })

  // TODO: Send email with OTP
  console.log(`OTP for ${email}: ${otp}`)

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully. Please verify your email.',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified
    }
  })
})

export const login = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  // Find user
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return next(new AppError('Invalid email or password', 401))
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return next(new AppError('Invalid email or password', 401))
  }

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })

  res.json({
    status: 'success',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified
    }
  })
})

export const getMe = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true
    }
  })

  if (!user) {
    return next(new AppError('User not found', 404))
  }

  res.json({
    status: 'success',
    user
  })
})

export const verifyEmail = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, code } = req.body

  // Find OTP
  const otpRecord = await prisma.oTPCode.findFirst({
    where: {
      email,
      code,
      purpose: 'EMAIL_VERIFICATION',
      isUsed: false,
      expiresAt: { gte: new Date() }
    }
  })

  if (!otpRecord) {
    return next(new AppError('Invalid or expired OTP', 400))
  }

  // Update user
  await prisma.user.update({
    where: { email },
    data: { isVerified: true }
  })

  // Mark OTP as used
  await prisma.oTPCode.update({
    where: { id: otpRecord.id },
    data: { isUsed: true }
  })

  res.json({
    status: 'success',
    message: 'Email verified successfully'
  })
})

export const forgotPassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email } = req.body

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return next(new AppError('No user found with that email', 404))
  }

  // Generate OTP
  const otp = generateOTP()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.oTPCode.create({
    data: {
      email: user.email,
      code: otp,
      purpose: 'PASSWORD_RESET',
      expiresAt
    }
  })

  // TODO: Send email with OTP
  console.log(`Password reset OTP for ${email}: ${otp}`)

  res.json({
    status: 'success',
    message: 'Password reset OTP sent to your email'
  })
})

export const resetPassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { email, code, newPassword } = req.body

  // Find OTP
  const otpRecord = await prisma.oTPCode.findFirst({
    where: {
      email,
      code,
      purpose: 'PASSWORD_RESET',
      isUsed: false,
      expiresAt: { gte: new Date() }
    }
  })

  if (!otpRecord) {
    return next(new AppError('Invalid or expired OTP', 400))
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12)

  // Update user password
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  })

  // Mark OTP as used
  await prisma.oTPCode.update({
    where: { id: otpRecord.id },
    data: { isUsed: true }
  })

  res.json({
    status: 'success',
    message: 'Password reset successfully'
  })
})
