import { Response, NextFunction } from 'express'
import { prisma } from '../utils/db'
import { AuthRequest } from '../middleware/auth'
import { AppError, catchAsync } from '../utils/errors'

export const createReview = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { productId, rating, comment } = req.body

  // Create guest user ID if not authenticated
  const userId = req.user?.userId || `guest-${Date.now()}`

  // Check if product exists
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) {
    return next(new AppError('Product not found', 404))
  }

  // For authenticated users, check if already reviewed
  if (req.user) {
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: req.user.userId,
          productId
        }
      }
    })

    if (existingReview) {
      return next(new AppError('You have already reviewed this product', 400))
    }
  }

  // Create or find guest user
  let user
  if (!req.user) {
    user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `guest-${Date.now()}@temp.com`,
        password: 'guest',
        name: 'Anonymous User',
        isVerified: false
      }
    })
  }

  const review = await prisma.review.create({
    data: {
      userId: req.user?.userId || user!.id,
      productId,
      rating,
      comment
    },
    include: {
      user: {
        select: { id: true, name: true }
      }
    }
  })

  res.status(201).json({
    status: 'success',
    review: {
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      userName: review.user?.name || 'Anonymous',
      rating: review.rating,
      comment: review.comment || '',
      date: review.createdAt.toISOString(),
      helpful: 0,
      verified: review.isVerified
    }
  })
})

export const getProductReviews = catchAsync(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
    : 0

  res.json({
    status: 'success',
    results: reviews.length,
    averageRating: parseFloat(averageRating.toFixed(1)),
    reviews
  })
})

export const updateReview = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('You must be logged in to update a review', 401))
  }

  const { id } = req.params
  const { rating, comment } = req.body

  const review = await prisma.review.findUnique({ where: { id } })
  if (!review) {
    return next(new AppError('Review not found', 404))
  }

  if (review.userId !== req.user.userId) {
    return next(new AppError('You can only update your own reviews', 403))
  }

  const updatedReview = await prisma.review.update({
    where: { id },
    data: { rating, comment },
    include: {
      user: {
        select: { id: true, name: true }
      }
    }
  })

  res.json({
    status: 'success',
    review: updatedReview
  })
})

export const deleteReview = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('You must be logged in to delete a review', 401))
  }

  const { id } = req.params

  const review = await prisma.review.findUnique({ where: { id } })
  if (!review) {
    return next(new AppError('Review not found', 404))
  }

  if (review.userId !== req.user.userId && req.user.role !== 'ADMIN') {
    return next(new AppError('You can only delete your own reviews', 403))
  }

  await prisma.review.delete({ where: { id } })

  res.status(204).json({
    status: 'success',
    data: null
  })
})
