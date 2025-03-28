import { Router } from 'express';
import { TermsAndConditionsController } from './tc.controller';

const router = Router();
router.post('/create-terms-and-conditions', TermsAndConditionsController.createTermsAndConditions);
router.get('/', TermsAndConditionsController.getTermsAndConditions);

export const TermsAndConditionsRoutes = router;
