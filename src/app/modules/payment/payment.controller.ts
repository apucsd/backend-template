import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payment.service';
import sendResponse from '../../../shared/sendResponse';

const makePaymentIntent = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await PaymentService.makePaymentIntent(payload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Payment intent create successfully',
        data: result,
    });
});

export const PaymentController = {
    makePaymentIntent,
};
