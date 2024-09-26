import { Schema, model } from 'mongoose';
import { TFaq } from './faq.interface';

const FaqSchema = new Schema<TFaq>(
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
    },
);

export const Faq = model<TFaq>('faq', FaqSchema);
