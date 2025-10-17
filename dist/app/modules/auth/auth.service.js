"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const emailHelper_1 = require("../../../helpers/emailHelper");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const emailTemplate_1 = require("../../../shared/emailTemplate");
const cryptoToken_1 = __importDefault(require("../../../util/cryptoToken"));
const generateOTP_1 = __importDefault(require("../../../util/generateOTP"));
const resetToken_model_1 = require("../resetToken/resetToken.model");
const user_model_1 = require("../user/user.model");
//login
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isExistUser = yield user_model_1.User.findOne({ email }).select('+password');
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //check verified and status
    if (!isExistUser.verified) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please verify your account, then try to login again');
    }
    //check user status
    if (isExistUser.status === 'delete') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'It looks like your account has been deactivated.');
    }
    //check match password
    if (password &&
        !(yield user_model_1.User.isMatchPassword(password, isExistUser.password))) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect!');
    }
    const jwtPayload = {
        id: isExistUser._id,
        role: isExistUser.role,
        email: isExistUser.email,
    };
    //create token
    const accessToken = jwtHelper_1.jwtHelper.createToken(jwtPayload, config_1.default.jwt.jwt_access_token_secret, config_1.default.jwt.access_token_expire_in);
    const refreshToken = jwtHelper_1.jwtHelper.createToken(jwtPayload, config_1.default.jwt.jwt_refresh_token_secret, config_1.default.jwt.refresh_token_expire_in);
    return { accessToken, refreshToken };
});
//forget password
const forgetPasswordToDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.isExistUserByEmail(email);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //send mail
    const otp = (0, generateOTP_1.default)();
    const value = {
        otp,
        email: isExistUser.email,
    };
    const forgetPassword = emailTemplate_1.emailTemplate.resetPassword(value);
    emailHelper_1.emailHelper.sendEmail(forgetPassword);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    yield user_model_1.User.findOneAndUpdate({ email }, { $set: { authentication } });
});
//verify email
const verifyEmailToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, oneTimeCode } = payload;
    const isExistUser = yield user_model_1.User.findOne({ email }).select('+authentication');
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (!oneTimeCode) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please give the otp, check your email we send a code');
    }
    if (((_a = isExistUser.authentication) === null || _a === void 0 ? void 0 : _a.oneTimeCode) !== oneTimeCode) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You provided wrong otp');
    }
    const date = new Date();
    if (date > ((_b = isExistUser.authentication) === null || _b === void 0 ? void 0 : _b.expireAt)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Otp already expired, Please try again');
    }
    let message;
    let data;
    if (!isExistUser.verified) {
        yield user_model_1.User.findOneAndUpdate({ _id: isExistUser._id }, { verified: true, authentication: { oneTimeCode: null, expireAt: null } });
        message = 'Email verify successfully';
    }
    else {
        yield user_model_1.User.findOneAndUpdate({ _id: isExistUser._id }, {
            authentication: {
                isResetPassword: true,
                oneTimeCode: null,
                expireAt: null,
            },
        });
        //create token ;
        const createToken = (0, cryptoToken_1.default)();
        yield resetToken_model_1.ResetToken.create({
            user: isExistUser._id,
            token: createToken,
            expireAt: new Date(Date.now() + 5 * 60000),
        });
        message =
            'Verification Successful: Please securely store and utilize this code for reset password';
        data = createToken;
    }
    return { data, message };
});
// resend otp again
const resendOtpToDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    // Generate a new OTP
    const otp = (0, generateOTP_1.default)();
    const values = {
        otp,
        email,
    };
    const resentOtpTemplate = emailTemplate_1.emailTemplate.resetOtp(values);
    emailHelper_1.emailHelper.sendEmail(resentOtpTemplate);
    /// set new otp in the user database
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    yield user_model_1.User.findOneAndUpdate({ email }, { $set: { authentication } });
});
//forget password
const resetPasswordToDB = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Token is required');
    }
    const { newPassword, confirmPassword } = payload;
    // Check if token exists
    const isExistToken = yield resetToken_model_1.ResetToken.isExistToken(token);
    if (!isExistToken) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized');
    }
    // Check if user exists
    const isExistUser = yield user_model_1.User.findById(isExistToken.user).select('+authentication');
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You don't have permission to change the password. Please click again to 'Forgot Password'");
    }
    // Check if the token is still valid
    const isValid = yield resetToken_model_1.ResetToken.isExpireToken(token);
    if (!isValid) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Token expired, Please click again to the forget password');
    }
    // Check if passwords match
    if (newPassword !== confirmPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "New password and Confirm password doesn't match!");
    }
    // Hash new password
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    // Update user password and reset authentication flag
    const updateData = {
        password: hashPassword,
        authentication: {
            isResetPassword: false,
        },
    };
    yield user_model_1.User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
        new: true,
    });
});
const changePasswordToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword, confirmPassword } = payload;
    const isExistUser = yield user_model_1.User.findById(user.id).select('+password');
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //current password match
    if (currentPassword &&
        !(yield user_model_1.User.isMatchPassword(currentPassword, isExistUser.password))) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect');
    }
    //newPassword and current password
    if (currentPassword === newPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please give different password from current password');
    }
    //new password and confirm password check
    if (newPassword !== confirmPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password and Confirm password doesn't matched");
    }
    //hash password
    const hashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updateData = {
        password: hashPassword,
    };
    yield user_model_1.User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwt_refresh_token_secret);
    const { id } = decoded;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not found');
    }
    //check verified and status
    if (!isExistUser.verified) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please verify your account, then try to login again');
    }
    //check user status
    if (isExistUser.status === 'delete') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'It looks like your account has been deactivated.');
    }
    const jwtPayload = {
        id: isExistUser._id,
        role: isExistUser.role,
        email: isExistUser.email,
    };
    //create token
    const accessToken = jwtHelper_1.jwtHelper.createToken(jwtPayload, config_1.default.jwt.jwt_access_token_secret, config_1.default.jwt.access_token_expire_in);
    return { accessToken };
});
exports.AuthService = {
    verifyEmailToDB,
    loginUserFromDB,
    forgetPasswordToDB,
    resetPasswordToDB,
    changePasswordToDB,
    resendOtpToDB,
    refreshToken,
};
