import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from './product.service';
import { Request, Response } from 'express';

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
      const result = await ProductService.getAllProductFromDB(req.query);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Products retrieved successfully',
            data: result,
      });
});
const createProduct = catchAsync(async (req: Request, res: Response) => {
      const parsedData = JSON.parse(req.body.data);
      if (req.files && 'image' in req.files && req.files.image[0]) {
            parsedData.image = `/images/${req.files.image[0].filename}`;
      }
      const result = await ProductService.createProductIntoDB(parsedData);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Product created successfully!!!',
            data: result,
      });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
      let parsedData: any = {};
      if (req.body.data) {
            parsedData = JSON.parse(req.body.data);
      }

      if (req.files && 'image' in req.files && req.files.image[0]) {
            parsedData.image = `/images/${req.files.image[0].filename}`;
      }

      const result = await ProductService.updateProductIntoDB(req.params.id, parsedData);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Product updated successfully!!!',
            data: result,
      });
});

export const ProductController = {
      createProduct,
      getAllProduct,
      updateProduct,
};
