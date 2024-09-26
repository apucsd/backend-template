import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NotificationService } from './notification.service';

const readNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const result = await NotificationService.readNotificationFromDB(user);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Notification read successfully',
        data: { unreadNotifications: result },
    });
});
const readUserNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const result = await NotificationService.readUserNotificationFromDB(user);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Notification read successfully',
        data: { unreadNotifications: result },
    });
});
const getNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const query = req.query;

    const result = await NotificationService.getNotificationsFromDB(user, query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Admin notification retrieved successfully',
        data: result,
    });
});
const getMyNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const query = req.query;

    const result = await NotificationService.getMyNotificationsFromDB(user, query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'User notification retrieved successfully',
        data: result,
    });
});

export const NotificationController = {
    // createNotification,
    readNotification,
    getNotification,
    getMyNotification,
    readUserNotification,
};
