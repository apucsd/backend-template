import { Request, Response } from 'express';
import { PackageService } from './package.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status-codes';

const createPackage = catchAsync(async (req: Request, res: Response) => {
      const result = await PackageService.createPackageIntoDB(req.body);
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Package created successfully',
            data: result,
      });
});

const getAllPackages = catchAsync(async (req: Request, res: Response) => {
      const result = await PackageService.getAllPackages();
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Packages retrieved successfully',
            data: result,
      });
});

const getSinglePackage = catchAsync(async (req: Request, res: Response) => {
      const result = await PackageService.getSinglePackage(req.params.id);
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Package retrieved successfully',
            data: result,
      });
});

export const PackageController = {
      createPackage,
      getAllPackages,
      getSinglePackage,
};
