import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { FAQRoutes } from '../app/modules/faqs/faq.route';
import { PrivacyPolicyRoutes } from '../app/modules/privacy-policy/pp.route';
import { TermsAndConditionsRoutes } from '../app/modules/terms-and-conditions/tc.route';

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
            route: FAQRoutes,
      },
      {
            path: '/privacy-policy',
            route: PrivacyPolicyRoutes,
      },
      {
            path: '/terms-and-conditions',
            route: TermsAndConditionsRoutes,
      },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
