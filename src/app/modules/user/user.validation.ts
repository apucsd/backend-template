import { z } from 'zod';

const createUserZodSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        contact: z.string().optional(),
        email: z.string({ required_error: 'Email is required' }),
        password: z.string({ required_error: 'Password is required' }),
        location: z.string().optional(),
        profile: z.string().optional(),
    }),
});

const userStatusZodSchema = z.object({
    body: z.object({
        status: z.enum(['active', 'delete'], {
            required_error: 'User Status is required',
        }),
    }),
});

export const UserValidation = {
    createUserZodSchema,
    userStatusZodSchema,
};
