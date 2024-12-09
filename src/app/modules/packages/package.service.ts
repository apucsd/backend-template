import { IPackage } from './package.interface';

import stripe from '../../config/stripe.config';
import httpStatus from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Package } from './package.model';

const createPackageIntoDB = async (payload: IPackage) => {
      try {
            // Create a product in Stripe
            const product = await stripe.products.create({
                  name: payload.name,
                  description: payload.description,
            });
            console.log(product);

            const price = await stripe.prices.create({
                  product: product.id,
                  unit_amount: payload.price * 100, // Convert to cents
                  currency: 'usd',
            });

            console.log(price);

            // Create a payment link
            const paymentLink = await stripe.paymentLinks.create({
                  line_items: [{ price: price.id, quantity: 1 }],
                  // Set the payment link to expire in 1 hour
                  allow_promotion_codes: true,
            });

            // Add Stripe-specific IDs to the payload
            const packageData = {
                  ...payload,
                  stripePriceId: price.id,
                  paymentLink: paymentLink.url,
            };

            const createPackage = await Package.create(packageData);
            console.log(createPackage);

            return createPackage;
      } catch (error) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create package with Stripe');
      }
};

const getAllPackages = async () => {
      const packages = await Package.find({});
      return packages;
};

const getSinglePackage = async (id: string) => {
      const singlePackage = await Package.findById(id);
      return singlePackage;
};

export const PackageService = {
      createPackageIntoDB,
      getAllPackages,
      getSinglePackage,
};
