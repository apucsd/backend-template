import { model, Schema } from 'mongoose';
import { IPP } from './pp.interface';

const PPSchema = new Schema<IPP>(
      {
            content: { type: String, required: true },
      },
      { timestamps: true }
);

export const PrivacyPolicy = model<IPP>('PrivacyPolicy', PPSchema);
