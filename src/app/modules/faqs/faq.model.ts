import mongoose, { Schema } from 'mongoose';
import { IFAQ } from './faq.interface';

const faqSchema = new Schema<IFAQ>(
      {
            question: {
                  type: String,
                  required: true,
            },
            answer: {
                  type: String,
                  required: true,
            },
      },
      {
            timestamps: true,
      }
);

export const FAQ = mongoose.model<IFAQ>('FAQ', faqSchema);
