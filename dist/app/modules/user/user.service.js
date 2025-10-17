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
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const emailHelper_1 = require("../../../helpers/emailHelper");
const emailTemplate_1 = require("../../../shared/emailTemplate");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const generateOTP_1 = __importDefault(require("../../../util/generateOTP"));
const user_model_1 = require("./user.model");
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const createUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //set role
    payload.role = user_1.USER_ROLES.USER;
    const createUser = yield user_model_1.User.create(payload);
    if (!createUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create user');
    }
    //send email
    const otp = (0, generateOTP_1.default)();
    const values = {
        name: createUser.name,
        otp: otp,
        email: createUser.email,
    };
    const createAccountTemplate = emailTemplate_1.emailTemplate.createAccount(values);
    emailHelper_1.emailHelper.sendEmail(createAccountTemplate);
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    yield user_model_1.User.findOneAndUpdate({ _id: createUser._id }, { $set: { authentication } });
    return createUser;
});
const createAdminToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //set role
    payload.role = user_1.USER_ROLES.ADMIN;
    payload.verified = true;
    const createUser = yield user_model_1.User.create(payload);
    if (!createUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create admin');
    }
    return createUser;
});
// const createSuperAdminToDB = async (payload: Partial<IUser>): Promise<IUser> => {
//     //set role
//     payload.role = USER_ROLES.SUPER_ADMIN;
//     payload.verified = true;
//     const createUser = await User.create(payload);
//     if (!createUser) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create super admin');
//     }
//     return createUser;
// };
const getUserProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
});
const getAllUserFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userModal = new QueryBuilder_1.default(user_model_1.User.find({ role: user_1.USER_ROLES.USER }), query)
        .search(['name', 'email'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield userModal.modelQuery;
    const meta = yield userModal.countTotal();
    return {
        data,
        meta,
    };
});
const getAllAdminFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userModal = new QueryBuilder_1.default(user_model_1.User.find({ role: user_1.USER_ROLES.ADMIN }), query)
        .search(['name', 'email'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield userModal.modelQuery;
    const meta = yield userModal.countTotal();
    return {
        data,
        meta,
    };
});
const getUserByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const updateProfileToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    if (payload.email) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Email cannot be changed!!!');
    }
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //unlink file here
    if (payload.profile) {
        (0, unlinkFile_1.default)(isExistUser.profile);
    }
    const updateDoc = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return updateDoc;
});
const deleteAccountFromDB = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findOne({ email }).select('+password');
    //check match password
    if (password && isExistUser && !(yield user_model_1.User.isMatchPassword(password, isExistUser.password))) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect!');
    }
    const result = yield user_model_1.User.findOneAndUpdate({ email: isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.email }, {
        $set: {
            status: 'delete',
        },
    }, {
        new: true,
    });
    return result;
});
const updateStatusIntoDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOneAndUpdate({ _id: id }, {
        $set: {
            status: status,
        },
    }, {
        new: true,
    });
    return result;
});
exports.UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB,
    getAllUserFromDB,
    getUserByIdFromDB,
    deleteAccountFromDB,
    createAdminToDB,
    // createSuperAdminToDB,
    getAllAdminFromDB,
    updateStatusIntoDB,
};
