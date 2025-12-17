import { Router } from 'express'
import { body } from 'express-validator'
import * as reviewController from '../controllers/reviewController'
import { protect } from '../middleware/auth'

const router = Router()

router.post(
  '/',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString()
  ],
  reviewController.createReview
)

router.get('/product/:productId', reviewController.getProductReviews)
router.put('/:id', protect, reviewController.updateReview)
router.delete('/:id', protect, reviewController.deleteReview)

export default router
