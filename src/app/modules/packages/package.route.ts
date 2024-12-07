import { Router } from 'express';
import { PackageController } from './package.controller';

const router = Router();

router.post('/create-package', PackageController.createPackage);

export const PackageRoutes = router;
