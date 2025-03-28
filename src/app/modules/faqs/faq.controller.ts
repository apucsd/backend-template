import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FAQService } from './faq.service';

const createFAQ = catchAsync(async (req, res) => {
      const { ...faqData } = req.body;
      const result = await FAQService.createFAQToDB(faqData);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'FAQ created successfully',
            data: result,
      });
});

const updateFAQ = catchAsync(async (req, res) => {
      const { id } = req.params;
      const { ...faqData } = req.body;

      const result = await FAQService.updateFAQToDB(id, faqData);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'FAQ updated successfully',
            data: result,
      });
});

const getAllFAQs = catchAsync(async (req, res) => {
      const { result, meta } = await FAQService.getAllFAQsFromDB(req.query);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'FAQs fetched successfully',
            data: {
                  data: result,
                  meta,
            },
      });
});

const getActiveFAQs = catchAsync(async (req, res) => {
      const result = await FAQService.getActiveFAQsFromDB();
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Active FAQs fetched successfully',
            data: result,
      });
});

const getFAQById = catchAsync(async (req, res) => {
      const { id } = req.params;
      const result = await FAQService.getFAQById(id);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'FAQ fetched successfully',
            data: result,
      });
});

const deleteFAQ = catchAsync(async (req, res) => {
      const { id } = req.params;
      const result = await FAQService.deleteFAQFromDB(id);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'FAQ deleted successfully',
            data: result,
      });
});

export const FAQController = {
      createFAQ,
      updateFAQ,
      getAllFAQs,
      getActiveFAQs,
      getFAQById,
      deleteFAQ,
};
