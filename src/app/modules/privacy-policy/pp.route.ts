import { Router } from 'express';
import { PrivacyPolicyController } from './pp.controller';

const router = Router();
router.post('/create-privacy-policy', PrivacyPolicyController.createPrivacyPolicy);
router.get('/', PrivacyPolicyController.getPrivacyPolicy);

export const PrivacyPolicyRoutes = router;
