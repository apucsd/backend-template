import { model, Schema } from 'mongoose';
import { IPackage } from './package.interface';

const packageSchema = new Schema<IPackage>({
      name: {
            type: String,
            required: true,
      },
      description: {
            type: String,
            required: true,
      },
      price: {
            type: Number,
            required: true,
      },

      status: {
            type: String,
            required: true,
      },
      stripePriceId: {
            type: String,
            required: true,
      },
      paymentLink: {
            type: String,
            required: true,
      },
});

export const Package = model<IPackage>('Package', packageSchema);
