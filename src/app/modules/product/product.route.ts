import { Router } from 'express';
import { ProductController } from './product.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();

router.post('/create-product', fileUploadHandler(), ProductController.createProduct);

export const ProductRoutes = router;
