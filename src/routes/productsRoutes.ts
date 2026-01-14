import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct,deleteAllProducts } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.delete('/delete-all', deleteAllProducts);
export default router;