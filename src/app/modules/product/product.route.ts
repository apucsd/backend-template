import { Router } from 'express';
import { ProductController } from './product.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();

router.get('/', ProductController.getAllProduct);
router.post('/create-product', fileUploadHandler(), ProductController.createProduct);
router.patch('/:id', fileUploadHandler(), ProductController.updateProduct);

export const ProductRoutes = router;
