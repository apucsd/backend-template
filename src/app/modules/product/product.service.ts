import QueryBuilder from '../../../builder/QueryBuilder';
import { IProduct } from './product.interface';
import { Product } from './product.model';

const getAllProductFromDB = async (query: Record<string, any>) => {
      console.log(query);
      const productQuery = new QueryBuilder(Product.find(), query).search(['name']).filter().paginate().sort().fields();

      const result = await productQuery.modelQuery;
      const meta = await productQuery.countTotal();
      return {
            result,
            meta,
      };
};

const createProductIntoDB = async (payload: IProduct) => {
      const createProduct = await Product.create(payload);
      return createProduct;
};
const updateProductIntoDB = async (id: string, payload: IProduct) => {
      const result = await Product.findOneAndUpdate({ _id: id }, payload, { new: true });
      if (!result) {
            throw new Error('Product not found');
      }
      return result;
};

export const ProductService = {
      createProductIntoDB,
      getAllProductFromDB,
      updateProductIntoDB,
};
