import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { PrivacyPolicy } from './pp.model';
import { PrivacyPolicyService } from './pp.service';

const createPrivacyPolicy = catchAsync(async (req: Request, res: Response) => {
      const { ...privacyPolicy } = req.body;

      const result = await PrivacyPolicyService.createPrivacyPolicyToDB(privacyPolicy);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Privacy policy created successfully',
            data: result,
      });
});

const getPrivacyPolicy = catchAsync(async (req: Request, res: Response) => {
      const result = await PrivacyPolicyService.getPrivacyPolicyFromDB();

      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Privacy policy fetched successfully',
            data: result,
      });
});

export const PrivacyPolicyController = {
      createPrivacyPolicy,
      getPrivacyPolicy,
};
