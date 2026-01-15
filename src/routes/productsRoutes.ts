import { Router } from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts
} from '../controllers/productController';
import { protect } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/authorizeRoles';

const router = Router();

// Public route
router.get('/', getProducts);

// Protected routes
router.post('/', protect, authorizeRoles('admin', 'vendor'), createProduct);
router.put('/:id', protect, authorizeRoles('admin', 'vendor'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin', 'vendor'), deleteProduct);
router.delete('/delete-all', protect, authorizeRoles('admin'), deleteAllProducts);

export default router;
