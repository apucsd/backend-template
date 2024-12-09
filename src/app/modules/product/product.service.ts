import { IProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (payload: IProduct) => {
      const createProduct = await Product.create(payload);
      return createProduct;
};

export const ProductService = {
      createProductIntoDB,
};
