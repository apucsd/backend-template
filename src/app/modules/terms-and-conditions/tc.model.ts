import { model, Schema } from 'mongoose';
import { TC } from './tc.interface';

const TCSchema = new Schema<TC>(
      {
            content: { type: String, required: true },
      },
      { timestamps: true }
);

export const TermsAndConditions = model<TC>('TermsAndConditions', TCSchema);
