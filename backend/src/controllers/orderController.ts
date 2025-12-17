import { Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'
import { AppError, catchAsync } from '../utils/errors'
import { generateOrderNumber, generateTrackingId } from '../utils/generators'

const prisma = new PrismaClient()

export const createOrder = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log('Order request body:', JSON.stringify(req.body, null, 2));
  
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }
  
  const {
    items,
    shippingAddress,
    paymentMethod = 'COD',
    customerName,
    customerPhone,
    customerEmail
  } = req.body

  if (!items || items.length === 0) {
    return next(new AppError('Order must contain at least one item', 400))
  }

  // Calculate totals
  let subtotal = 0
  const orderItems = []

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } })
    if (!product) {
      return next(new AppError(`Product ${item.productId} not found`, 404))
    }
    subtotal += product.price * item.quantity
    orderItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
      size: item.size
    })
  }

  const shipping = subtotal > 500 ? 0 : 50 // Free shipping above ₹500
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + shipping + tax

  const orderNumber = generateOrderNumber()
  const trackingId = generateTrackingId()

  try {
    console.log('Creating order with data:', { orderNumber, trackingId, userId: req.user.userId, customerName, customerPhone });
    
    // Create order with tracking
    const order = await prisma.order.create({
      data: {
        orderNumber,
        trackingId,
        userId: req.user.userId,
        status: 'PENDING',
        paymentMethod: paymentMethod as 'COD' | 'CARD' | 'UPI' | 'WALLET',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress,
        customerName,
        customerPhone,
        customerEmail,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    console.log('Order created:', order.id);

    // Create tracking separately
    await prisma.orderTracking.create({
      data: {
        orderId: order.id,
        status: 'CREATED',
        currentStep: 0
      }
    })

    console.log('Tracking created');

    // Create initial tracking step
    const tracking = await prisma.orderTracking.findUnique({
      where: { orderId: order.id }
    })

    if (tracking) {
      await prisma.trackingStep.create({
        data: {
          trackingId: tracking.id,
          step: 'Order Placed',
          description: 'Your order has been received',
          isCompleted: true
        }
      })
      console.log('Tracking step created');
    }

    // Fetch complete order with tracking
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        tracking: {
          include: {
            trackingSteps: true
          }
        }
      }
    })

    console.log('Complete order fetched');

    res.status(201).json({
      status: 'success',
      order: completeOrder
    })
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
})

export const getUserOrders = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401))
  }

  const orders = await prisma.order.findMany({
    where: { userId: req.user.userId },
    include: {
      items: {
        include: {
          product: true
        }
      },
      tracking: true
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json({
    status: 'success',
    results: orders.length,
    orders
  })
})

export const updateOrderStatus = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { status } = req.body

  if (!status) {
    return next(new AppError('Status is required', 400))
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: status as any },
    include: {
      items: {
        include: {
          product: true
        }
      },
      tracking: true
    }
  })

  res.json({
    status: 'success',
    order
  })
})

export const getOrder = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true
        }
      },
      tracking: {
        include: {
          trackingSteps: {
            orderBy: { timestamp: 'asc' }
          }
        }
      }
    }
  })

  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  // Check authorization
  if (req.user && order.userId && order.userId !== req.user.userId && req.user.role !== 'ADMIN') {
    return next(new AppError('You do not have permission to view this order', 403))
  }

  res.json({
    status: 'success',
    order
  })
})

export const getOrderByNumber = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { orderNumber } = req.params

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: true
        }
      },
      tracking: {
        include: {
          trackingSteps: {
            orderBy: { timestamp: 'asc' }
          }
        }
      }
    }
  })

  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  res.json({
    status: 'success',
    order
  })
})

export const trackOrder = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params

  // First try to find order by tracking ID
  let order = await prisma.order.findUnique({
    where: { trackingId: id },
    include: {
      items: {
        include: {
          product: true
        }
      },
      tracking: {
        include: {
          trackingSteps: {
            orderBy: { timestamp: 'asc' }
          }
        }
      }
    }
  })

  // If not found by tracking ID, try by order ID
  if (!order) {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        tracking: {
          include: {
            trackingSteps: {
              orderBy: { timestamp: 'asc' }
            }
          }
        }
      }
    })
  }

  // If still not found, try by order number
  if (!order) {
    order = await prisma.order.findUnique({
      where: { orderNumber: id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        tracking: {
          include: {
            trackingSteps: {
              orderBy: { timestamp: 'asc' }
            }
          }
        }
      }
    })
  }

  if (!order) {
    return next(new AppError('Order not found. Please check your Order ID or Tracking ID.', 404))
  }

  res.json({
    status: 'success',
    order
  })
})
