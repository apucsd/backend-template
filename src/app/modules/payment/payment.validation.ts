// import { z } from 'zod';
// import { Types } from 'mongoose';

// export const paymentIntentZodSchema = z.object({
//     body: z.object({
//         user: z.string().refine((val) => Types.ObjectId.isValid(val), {
//             message: 'Invalid ObjectId for user',
//         }),
//         amount: z.number().positive('Amount must be greater than 0'),
//         currency: z.string().nonempty('Currency is required'),
//         description: z.string().optional(),
//     }),
// });

// export const PaymentIntentValidation = {
//     paymentIntentZodSchema,
// };
