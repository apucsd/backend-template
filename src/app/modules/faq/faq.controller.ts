import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { FaqServices } from './faq.service';
import sendResponse from '../../../shared/sendResponse';

const createFaq = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await FaqServices.createFaqToDB(payload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'FAQ created successfully',
        data: result,
    });
});
const getFaqs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FaqServices.getFaqFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'FAQs retried successfully',
        data: result,
    });
});
const updateFaq = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await FaqServices.updateFaqToDB(id, payload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'FAQ updated successfully',
        data: result,
    });
});
const deleteFaq = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await FaqServices.deleteFaqToDB(id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'FAQ deleted successfully',
        data: result,
    });
});

export const FaqController = {
    createFaq,
    getFaqs,
    updateFaq,
    deleteFaq,
};
