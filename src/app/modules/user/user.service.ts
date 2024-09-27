import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import QueryBuilder from '../../../builder/QueryBuilder';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
    //set role
    payload.role = USER_ROLES.USER;
    const createUser = await User.create(payload);
    if (!createUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    //send email
    const otp = generateOTP();
    const values = {
        name: createUser.name,
        otp: otp,
        email: createUser.email!,
    };
    const createAccountTemplate = emailTemplate.createAccount(values);
    emailHelper.sendEmail(createAccountTemplate);

    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    await User.findOneAndUpdate({ _id: createUser._id }, { $set: { authentication } });

    return createUser;
};
const createAdminToDB = async (payload: Partial<IUser>): Promise<IUser> => {
    //set role
    payload.role = USER_ROLES.ADMIN;
    payload.verified = true;
    const createUser = await User.create(payload);
    if (!createUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin');
    }

    return createUser;
};
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

const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
    const { id } = user;
    const isExistUser = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    return isExistUser;
};

const getAllUserFromDB = async (query: Record<string, any>) => {
    const userModal = new QueryBuilder(User.find({ role: USER_ROLES.USER }), query)
        .search(['name', 'email'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = await userModal.modelQuery;
    const meta = await userModal.countTotal();

    return {
        data,
        meta,
    };
};
const getAllAdminFromDB = async (query: Record<string, any>) => {
    const userModal = new QueryBuilder(User.find({ role: USER_ROLES.ADMIN }), query)
        .search(['name', 'email'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = await userModal.modelQuery;
    const meta = await userModal.countTotal();

    return {
        data,
        meta,
    };
};

const getUserByIdFromDB = async (id: string) => {
    const result = await User.findById(id);
    return result;
};

const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
    const { id } = user;

    if (payload.email) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Email cannot be changed!!!');
    }
    const isExistUser = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    //unlink file here
    if (payload.profile) {
        unlinkFile(isExistUser.profile);
    }

    const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });

    return updateDoc;
};

const deleteAccountFromDB = async (email: string, password: string) => {
    const isExistUser = await User.findOne({ email }).select('+password');
    //check match password
    if (password && isExistUser && !(await User.isMatchPassword(password, isExistUser.password))) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
    }

    const result = await User.findOneAndUpdate(
        { email: isExistUser?.email },
        {
            $set: {
                status: 'delete',
            },
        },

        {
            new: true,
        },
    );

    return result;
};
const updateStatusIntoDB = async (id: string, status: string) => {
    const result = await User.findOneAndUpdate(
        { _id: id },
        {
            $set: {
                status: status,
            },
        },

        {
            new: true,
        },
    );

    return result;
};

export const UserService = {
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
