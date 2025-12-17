import { Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { AppError, catchAsync } from '../utils/errors'

const prisma = new PrismaClient()

export const getProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
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
      createdAt: true,
      updatedAt: true
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

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }

  const { name, phone } = req.body

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: { name, phone },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isVerified: true
    }
  })

  res.json({
    status: 'success',
    user
  })
})

export const getAddresses = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }

  const addresses = await prisma.address.findMany({
    where: { userId: req.user.userId },
    orderBy: { isDefault: 'desc' }
  })

  res.json({
    status: 'success',
    results: addresses.length,
    addresses
  })
})

export const createAddress = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }

  const { type, firstName, lastName, streetAddress, city, state, zipCode, country, phone, isDefault } = req.body

  // If this is default, unset others
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.userId, isDefault: true },
      data: { isDefault: false }
    })
  }

  const address = await prisma.address.create({
    data: {
      userId: req.user.userId,
      type,
      firstName,
      lastName,
      streetAddress,
      city,
      state,
      zipCode,
      country: country || 'India',
      phone,
      isDefault: isDefault || false
    }
  })

  res.status(201).json({
    status: 'success',
    address
  })
})

export const updateAddress = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }

  const { id } = req.params
  const { type, firstName, lastName, streetAddress, city, state, zipCode, country, phone, isDefault } = req.body

  // Check ownership
  const existingAddress = await prisma.address.findUnique({ where: { id } })
  if (!existingAddress || existingAddress.userId !== req.user.userId) {
    return next(new AppError('Address not found', 404))
  }

  // If this is default, unset others
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.userId, isDefault: true, id: { not: id } },
      data: { isDefault: false }
    })
  }

  const address = await prisma.address.update({
    where: { id },
    data: {
      type,
      firstName,
      lastName,
      streetAddress,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault
    }
  })

  res.json({
    status: 'success',
    address
  })
})

export const deleteAddress = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }

  const { id } = req.params

  const address = await prisma.address.findUnique({ where: { id } })
  if (!address || address.userId !== req.user.userId) {
    return next(new AppError('Address not found', 404))
  }

  await prisma.address.delete({ where: { id } })

  res.status(204).json({
    status: 'success',
    data: null
  })
})

export const getFavorites = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user.userId },
    include: {
      product: true
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json({
    status: 'success',
    results: favorites.length,
    favorites: favorites.map((f: any) => ({
      ...f,
      product: {
        ...f.product,
        images: JSON.parse(f.product.images),
        sizes: JSON.parse(f.product.sizes),
        colors: JSON.parse(f.product.colors)
      }
    }))
  })
})

export const addFavorite = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }

  const { productId } = req.params

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) {
    return next(new AppError('Product not found', 404))
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId: req.user.userId,
      productId
    },
    include: {
      product: true
    }
  })

  res.status(201).json({
    status: 'success',
    favorite
  })
})

export const removeFavorite = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }

  const { productId } = req.params

  const favorite = await prisma.favorite.findFirst({
    where: {
      userId: req.user.userId,
      productId
    }
  })

  if (!favorite) {
    return next(new AppError('Favorite not found', 404))
  }

  await prisma.favorite.delete({ where: { id: favorite.id } })

  res.status(204).json({
    status: 'success',
    data: null
  })
})
