import { Router } from 'express'
import { validateApiKey } from '../middleware/apiKey'
import * as productController from '../controllers/productController'
import * as orderController from '../controllers/orderController'

const router = Router()

// All routes require API key authentication
router.use(validateApiKey)

/**
 * GET /api/external/products
 * Fetch all products with optional filters
 * Query params: category, subcategory, minPrice, maxPrice, search, page, limit
 */
router.get('/products', productController.getAllProducts)

/**
 * GET /api/external/products/:id
 * Fetch single product by ID
 */
router.get('/products/:id', productController.getProduct)

/**
 * POST /api/external/orders
 * Create a new order
 * Body: {
 *   items: [{ productId, quantity, size }],
 *   shippingAddress: { name, phone, street, city, state, zipCode, country },
 *   customerName: string,
 *   customerPhone: string,
 *   customerEmail?: string,
 *   paymentMethod?: 'cod'
 * }
 */
router.post('/orders', orderController.createOrder)

/**
 * GET /api/external/orders/:id
 * Get order details by ID
 */
router.get('/orders/:id', orderController.getOrder)

/**
 * GET /api/external/orders/number/:orderNumber
 * Get order details by order number
 */
router.get('/orders/number/:orderNumber', orderController.getOrderByNumber)

export default router
