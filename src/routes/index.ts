import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { PackageRoutes } from '../app/modules/packages/package.route';
import { ProductRoutes } from '../app/modules/product/product.route';

const router = express.Router();

const apiRoutes = [
      {
            path: '/users',
            route: UserRoutes,
      },
      {
            path: '/auth',
            route: AuthRoutes,
      },
      {
            path: '/products',
            route: ProductRoutes,
      },
      {
            path: '/packages',
            route: PackageRoutes,
      },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
