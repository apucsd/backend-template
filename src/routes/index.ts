import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { FaqRouter } from '../app/modules/faq/faq.route';
import { NotificationRoute } from '../app/modules/notification/notification.route';
import { PaymentRoute } from '../app/modules/payment/payment.route';
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
        path: '/faqs',
        route: FaqRouter,
    },
    {
        path: '/notifications',
        route: NotificationRoute,
    },
    {
        path: '/payments',
        route: PaymentRoute,
    },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
