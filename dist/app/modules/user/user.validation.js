"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        contact: zod_1.z.string().optional(),
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        location: zod_1.z.string().optional(),
        profile: zod_1.z.string().optional(),
    }),
});
const userStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['active', 'delete'], {
            required_error: 'User Status is required',
        }),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
    userStatusZodSchema,
};
