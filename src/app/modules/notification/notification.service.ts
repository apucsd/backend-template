import { JwtPayload } from 'jsonwebtoken';
import { Notification } from './notification.model';

import QueryBuilder from '../../../builder/QueryBuilder';
import { USER_ROLES } from '../../../enums/user';

// const createNotificationToDB = async (payload: TNotification) => {
//     const result = await Notification.create(payload);

// how a notification is created
// const notification = new Notification({
//     recipient: '66ec1000449843b5352d9f01',
//     message: 'A notification has been created',
//     read: false,
//     type: 'notification',
//     role: 'ADMIN',
// });

// await notification.save();

// ! notification create
// ! @ts-ignore
// const socketIo = global.io;
// if (socketIo) {
//     socketIo.emit(`notification}`, notification);
// }
//     return result;
// };

const readNotificationFromDB = async (user: JwtPayload) => {
    const getRole = user.role === USER_ROLES.SUPER_ADMIN ? USER_ROLES.ADMIN : user.role;
    let unreadNotifications;
    await Notification.updateMany({ role: getRole, read: false }, { read: true });

    unreadNotifications = await Notification.countDocuments({
        recipient: user.id,
        read: false,
    });
    return unreadNotifications;
};
const readUserNotificationFromDB = async (user: JwtPayload) => {
    let unreadNotifications;
    await Notification.updateMany({ role: user.role, read: false, recipient: user.id }, { read: true });

    unreadNotifications = await Notification.countDocuments({
        recipient: user.id,
        read: false,
    });
    return unreadNotifications;
};

const getNotificationsFromDB = async (user: JwtPayload, query: Record<string, unknown>) => {
    const getRole = user.role === USER_ROLES.SUPER_ADMIN ? USER_ROLES.ADMIN : user.role;
    const notificationModel = new QueryBuilder(Notification.find({ role: { $eq: getRole } }), query)
        .search(['message'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await notificationModel.modelQuery;

    const unreadNotifications = await Notification.countDocuments({
        read: false,
        role: { $eq: getRole },
    });

    const meta = await notificationModel.countTotal();

    return {
        result,
        meta,
        unreadNotifications,
    };
};
const getMyNotificationsFromDB = async (user: JwtPayload, query: Record<string, unknown>) => {
    const getRole = user.role === USER_ROLES.SUPER_ADMIN ? USER_ROLES.ADMIN : user.role;
    const notificationModel = new QueryBuilder(Notification.find({ role: { $eq: getRole }, recipient: user.id }), query)
        .search(['message'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await notificationModel.modelQuery;

    const unreadNotifications = await Notification.countDocuments({
        read: false,
        role: { $eq: getRole },
    });

    const meta = await notificationModel.countTotal();

    return {
        result,
        meta,
        unreadNotifications,
    };
};

export const NotificationService = {
    // createNotificationToDB,
    readNotificationFromDB,
    getNotificationsFromDB,
    getMyNotificationsFromDB,
    readUserNotificationFromDB,
};
