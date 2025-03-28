import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { TermsAndConditionsService } from './tc.service';

const createTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
      const { ...termsAndConditions } = req.body;

      const result = await TermsAndConditionsService.createTermsAndConditionsToDB(termsAndConditions);
      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Terms and conditions created successfully',
            data: result,
      });
});

const getTermsAndConditions = catchAsync(async (req: Request, res: Response) => {
      const result = await TermsAndConditionsService.getTermsAndConditionsFromDB();

      sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Terms and conditions fetched successfully',
            data: result,
      });
});

export const TermsAndConditionsController = {
      createTermsAndConditions,
      getTermsAndConditions,
};
