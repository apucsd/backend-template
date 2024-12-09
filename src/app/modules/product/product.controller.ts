import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from './product.service';
import { Request, Response } from 'express';

const createProduct = catchAsync(async (req: Request, res: Response) => {
      console.log(req.body.data);
      console.log(req.files);

      const result = await ProductService.createProductIntoDB(req.body);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Product created successfully!!!',
            data: result,
      });
});

export const ProductController = {
      createProduct,
};
