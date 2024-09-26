import Stripe from 'stripe';
import config from '../../../config';
import { IPayment } from './payment.interface';

const stripe = new Stripe(config.stripe_secret_key as string);

const makePaymentIntent = async (payload: IPayment) => {
    const amount = Math.trunc(payload.amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
    });

    const data = {
        client_secret: paymentIntent.client_secret,
        transactionId: paymentIntent.id,
    };
    return data;
};

export const PaymentService = { makePaymentIntent };
