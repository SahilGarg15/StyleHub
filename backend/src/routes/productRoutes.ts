import { Router } from 'express'
import * as productController from '../controllers/productController'

const router = Router()

router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProduct)
router.get('/category/:category', productController.getProductsByCategory)

export default router
