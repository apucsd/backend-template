import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        paymentMethodId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        paymentIntentId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        receiptEmail: {
            type: String,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

export const Payment = model<IPayment>('payment', paymentSchema);
