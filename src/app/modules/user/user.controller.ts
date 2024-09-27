import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User created successfully',
        data: result,
    });
});

const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createAdminToDB(userData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Admin created successfully',
        data: result,
    });
});
// const createSuperAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const { ...userData } = req.body;
//     const result = await UserService.createSuperAdminToDB(userData);

//     sendResponse(res, {
//         success: true,
//         statusCode: StatusCodes.OK,
//         message: 'Super Admin created successfully',
//         data: result,
//     });
// });

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await UserService.getUserProfileFromDB(user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile data retrieved successfully',
        data: result,
    });
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await UserService.getAllUserFromDB(req.query);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'All users retrieved successfully',
        data: {
            data,
            meta,
        },
    });
});
const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await UserService.getAllAdminFromDB(req.query);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'All admin retrieved successfully',
        data: {
            data,
            meta,
        },
    });
});
const getUserById = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getUserByIdFromDB(req?.params?.id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Single user retrieved successfully',
        data: result,
    });
});

//update profile
const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let profile;
    if (req.files && 'image' in req.files && req.files.image[0]) {
        profile = `/images/${req.files.image[0].filename}`;
    }

    const data = {
        profile,
        ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result,
    });
});
//delete account
const deleteAccount = catchAsync(async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const result = await UserService.deleteAccountFromDB(email, password);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User account deleted successfully',
        data: result,
    });
});

//update account status
const updateStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const status = req.body.status;
    const result = await UserService.updateStatusIntoDB(id, status);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User account deleted successfully',
        data: result,
    });
});
export const UserController = {
    createUser,
    getUserProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    deleteAccount,
    createAdmin,
    // createSuperAdmin,
    getAllAdmin,
    updateStatus,
};
