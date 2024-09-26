import { Router } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { NotificationController } from './notification.controller';

const router = Router();

router
    .route('/')
    .get(
        auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
        NotificationController.getNotification,
    );
router
    .route('/my-notification')
    .get(
        auth(USER_ROLES.USER, USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
        NotificationController.getMyNotification,
    );
router
    .route('/read-admin-notification')
    .patch(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER), NotificationController.readNotification);
router.route('/read-user-notification').patch(auth(USER_ROLES.USER), NotificationController.readUserNotification);

export const NotificationRoute = router;
