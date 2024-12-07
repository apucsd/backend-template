import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Request, Response } from 'express';
import { PackageService } from './package.service';

const createPackage = catchAsync(async (req: Request, res: Response) => {
      const result = await PackageService.createPackageIntoDB(req.body);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Package created successfully',
            data: result,
      });
});

export const PackageController = {
      createPackage,
};
