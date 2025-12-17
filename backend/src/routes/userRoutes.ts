import { Router } from 'express'
import { body } from 'express-validator'
import * as userController from '../controllers/userController'
import { protect } from '../middleware/auth'

const router = Router()

// All routes require authentication
router.use(protect)

router.get('/profile', userController.getProfile)
router.put('/profile', userController.updateProfile)

router.get('/addresses', userController.getAddresses)
router.post(
  '/addresses',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('streetAddress').notEmpty().withMessage('Street address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('zipCode').notEmpty().withMessage('Zip code is required')
  ],
  userController.createAddress
)
router.put('/addresses/:id', userController.updateAddress)
router.delete('/addresses/:id', userController.deleteAddress)

router.get('/favorites', userController.getFavorites)
router.post('/favorites/:productId', userController.addFavorite)
router.delete('/favorites/:productId', userController.removeFavorite)

export default router
