import { Router } from 'express';

import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { FaqController } from './faq.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FaqValidation } from './faq.validation';

const router = Router();

router.route('/').get(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER), FaqController.getFaqs);
router
    .route('/create-faq')
    .post(
        auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
        validateRequest(FaqValidation.createFaqZodSchema),
        FaqController.createFaq,
    );
router.route('/:id').patch(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), FaqController.updateFaq);
router.route('/:id').delete(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), FaqController.deleteFaq);

export const FaqRouter = router;
