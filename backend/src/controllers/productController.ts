import { Response, Request } from 'express'
import { prisma } from '../utils/db'
import { AppError, catchAsync } from '../utils/errors'

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const {
    category,
    subcategory,
    minPrice,
    maxPrice,
    search,
    sort = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 20
  } = req.query

  const where: any = { isActive: true }

  if (category) where.category = category as string
  if (subcategory) where.subcategory = subcategory as string
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseInt(minPrice as string)
    if (maxPrice) where.price.lte = parseInt(maxPrice as string)
  }
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } }
    ]
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: { [sort as string]: order },
      skip,
      take: parseInt(limit as string)
    }),
    prisma.product.count({ where })
  ])

  res.json({
    status: 'success',
    results: products.length,
    total,
    page: parseInt(page as string),
    totalPages: Math.ceil(total / parseInt(limit as string)),
    products: products.map((p: any) => {
      const reviewCount = p.reviews.length
      const averageRating = reviewCount > 0 
        ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount 
        : 0
      
      return {
        ...p,
        reviewCount,
        averageRating: parseFloat(averageRating.toFixed(1)),
        reviews: undefined, // Remove reviews array from response
        images: typeof p.images === 'string' ? (p.images.startsWith('[') ? JSON.parse(p.images) : p.images.split(',').map((s: string) => s.trim())) : p.images,
        sizes: typeof p.sizes === 'string' ? (p.sizes.startsWith('[') ? JSON.parse(p.sizes) : p.sizes.split(',').map((s: string) => s.trim())) : p.sizes,
        colors: typeof p.colors === 'string' ? (p.colors.startsWith('[') ? JSON.parse(p.colors) : p.colors.split(',').map((s: string) => s.trim())) : p.colors
      }
    })
  })
})

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!product) {
    throw new AppError('Product not found', 404)
  }

  const reviewCount = product.reviews.length
  const averageRating = reviewCount > 0 
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
    : 0

  res.json({
    status: 'success',
    product: {
      ...product,
      reviewCount,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviews: product.reviews.map((review: any) => ({
        id: review.id,
        productId: review.productId,
        userId: review.userId,
        userName: review.user?.name || 'Anonymous',
        rating: review.rating,
        comment: review.comment || '',
        date: review.createdAt.toISOString(),
        helpful: 0,
        verified: review.isVerified
      })),
      images: typeof product.images === 'string' ? (product.images.startsWith('[') ? JSON.parse(product.images) : product.images.split(',').map((s: string) => s.trim())) : product.images,
      sizes: typeof product.sizes === 'string' ? (product.sizes.startsWith('[') ? JSON.parse(product.sizes) : product.sizes.split(',').map((s: string) => s.trim())) : product.sizes,
      colors: typeof product.colors === 'string' ? (product.colors.startsWith('[') ? JSON.parse(product.colors) : product.colors.split(',').map((s: string) => s.trim())) : product.colors
    }
  })
})

export const getProductsByCategory = catchAsync(async (req: Request, res: Response) => {
  const { category } = req.params
  const { limit = 20 } = req.query

  const products = await prisma.product.findMany({
    where: {
      category,
      isActive: true
    },
    take: parseInt(limit as string),
    orderBy: { createdAt: 'desc' }
  })

  res.json({
    status: 'success',
    results: products.length,
    products: products.map((p: any) => ({
      ...p,
      images: typeof p.images === 'string' ? (p.images.startsWith('[') ? JSON.parse(p.images) : p.images.split(',').map((s: string) => s.trim())) : p.images,
      sizes: typeof p.sizes === 'string' ? (p.sizes.startsWith('[') ? JSON.parse(p.sizes) : p.sizes.split(',').map((s: string) => s.trim())) : p.sizes,
      colors: typeof p.colors === 'string' ? (p.colors.startsWith('[') ? JSON.parse(p.colors) : p.colors.split(',').map((s: string) => s.trim())) : p.colors
    }))
  })
})
