"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = exports.authValidation = void 0;
const zod_1 = require("zod");
const createVerifyEmailZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }),
        oneTimeCode: zod_1.z.number({ required_error: 'One time code is required' }),
    }),
});
const createLoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const createForgetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }),
    }),
});
const createResetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: zod_1.z.string({ required_error: 'Password is required' }),
        confirmPassword: zod_1.z.string({
            required_error: 'Confirm Password is required',
        }),
    }),
});
const resendOtpValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Invalid email address' }),
    }),
});
const createChangePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: 'Current Password is required',
        }),
        newPassword: zod_1.z.string({ required_error: 'New Password is required' }),
        confirmPassword: zod_1.z.string({
            required_error: 'Confirm Password is required',
        }),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
});
exports.authValidation = {
    refreshTokenValidationSchema,
};
exports.AuthValidation = {
    createVerifyEmailZodSchema,
    createForgetPasswordZodSchema,
    createLoginZodSchema,
    createResetPasswordZodSchema,
    createChangePasswordZodSchema,
    resendOtpValidation,
    refreshTokenValidationSchema,
};
