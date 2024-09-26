import { Router } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { PaymentController } from './payment.controller';
const router = Router();

router.route('/create-payment-intent').post(auth(USER_ROLES.USER), PaymentController.makePaymentIntent);
export const PaymentRoute = router;
