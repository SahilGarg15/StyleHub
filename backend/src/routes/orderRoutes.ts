import { Router } from 'express'
import { body } from 'express-validator'
import * as orderController from '../controllers/orderController'
import { protect } from '../middleware/auth'

const router = Router()

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('customerPhone').notEmpty().withMessage('Customer phone is required')
  ],
  orderController.createOrder
)

router.get('/', protect, orderController.getUserOrders)
router.get('/:id', orderController.getOrder)
router.patch('/:id/status', protect, orderController.updateOrderStatus)
router.get('/:id/track', orderController.trackOrder)
router.get('/number/:orderNumber', orderController.getOrderByNumber)

export default router
