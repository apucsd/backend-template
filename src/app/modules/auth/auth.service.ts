import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import {
  IAuthResetPassword,
  IChangePassword,
  ILoginData,
  IVerifyEmail,
} from '../../../types/auth';
import cryptoToken from '../../../util/cryptoToken';
import generateOTP from '../../../util/generateOTP';
import { ResetToken } from '../resetToken/resetToken.model';
import { User } from '../user/user.model';

//login
const loginUserFromDB = async (payload: ILoginData) => {
  const { email, password } = payload;
  const isExistUser = await User.findOne({ email }).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //check verified and status
  if (!isExistUser.verified) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please verify your account, then try to login again'
    );
  }

  //check user status
  if (isExistUser.status === 'delete') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'It looks like your account has been deactivated.'
    );
  }

  //check match password
  if (
    password &&
    !(await User.isMatchPassword(password, isExistUser.password))
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect!');
  }
  const jwtPayload = {
    id: isExistUser._id,
    role: isExistUser.role,
    email: isExistUser.email,
  };
  //create token
  const accessToken = jwtHelper.createToken(
    jwtPayload,
    config.jwt.jwt_access_token_secret as Secret,
    config.jwt.access_token_expire_in as string
  );
  const refreshToken = jwtHelper.createToken(
    jwtPayload,
    config.jwt.jwt_refresh_token_secret as Secret,
    config.jwt.refresh_token_expire_in as string
  );

  return { accessToken, refreshToken };
};

//forget password
const forgetPasswordToDB = async (email: string) => {
  const isExistUser = await User.isExistUserByEmail(email);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //send mail
  const otp = generateOTP();
  const value = {
    otp,
    email: isExistUser.email,
  };
  const forgetPassword = emailTemplate.resetPassword(value);
  emailHelper.sendEmail(forgetPassword);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate({ email }, { $set: { authentication } });
};

//verify email
const verifyEmailToDB = async (payload: IVerifyEmail) => {
  const { email, oneTimeCode } = payload;
  const isExistUser = await User.findOne({ email }).select('+authentication');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!oneTimeCode) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give the otp, check your email we send a code'
    );
  }

  if (isExistUser.authentication?.oneTimeCode !== oneTimeCode) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You provided wrong otp');
  }

  const date = new Date();
  if (date > isExistUser.authentication?.expireAt) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Otp already expired, Please try again'
    );
  }

  let message;
  let data;

  if (!isExistUser.verified) {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      { verified: true, authentication: { oneTimeCode: null, expireAt: null } }
    );
    message = 'Email verify successfully';
  } else {
    await User.findOneAndUpdate(
      { _id: isExistUser._id },
      {
        authentication: {
          isResetPassword: true,
          oneTimeCode: null,
          expireAt: null,
        },
      }
    );

    //create token ;
    const createToken = cryptoToken();
    await ResetToken.create({
      user: isExistUser._id,
      token: createToken,
      expireAt: new Date(Date.now() + 5 * 60000),
    });
    message =
      'Verification Successful: Please securely store and utilize this code for reset password';
    data = createToken;
  }
  return { data, message };
};
// resend otp again

const resendOtpToDB = async (email: string) => {
  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  // Generate a new OTP
  const otp = generateOTP();

  const values = {
    otp,
    email,
  };
  const resentOtpTemplate = emailTemplate.resetOtp(values);
  emailHelper.sendEmail(resentOtpTemplate);
  /// set new otp in the user database
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate({ email }, { $set: { authentication } });
};

//forget password
const resetPasswordToDB = async (
  token: string,
  payload: IAuthResetPassword
) => {
  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token is required');
  }
  const { newPassword, confirmPassword } = payload;
  // Check if token exists
  const isExistToken = await ResetToken.isExistToken(token);
  if (!isExistToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
  }

  // Check if user exists
  const isExistUser = await User.findById(isExistToken.user).select(
    '+authentication'
  );
  if (!isExistUser) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "You don't have permission to change the password. Please click again to 'Forgot Password'"
    );
  }

  // Check if the token is still valid
  const isValid = await ResetToken.isExpireToken(token);
  if (!isValid) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Token expired, Please click again to the forget password'
    );
  }

  // Check if passwords match
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "New password and Confirm password doesn't match!"
    );
  }

  // Hash new password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  // Update user password and reset authentication flag
  const updateData = {
    password: hashPassword,
    authentication: {
      isResetPassword: false,
    },
  };

  await User.findOneAndUpdate({ _id: isExistToken.user }, updateData, {
    new: true,
  });
};

const changePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePassword
) => {
  const { currentPassword, newPassword, confirmPassword } = payload;
  const isExistUser = await User.findById(user.id).select('+password');
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //current password match
  if (
    currentPassword &&
    !(await User.isMatchPassword(currentPassword, isExistUser.password))
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Password is incorrect');
  }

  //newPassword and current password
  if (currentPassword === newPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please give different password from current password'
    );
  }
  //new password and confirm password check
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password and Confirm password doesn't matched"
    );
  }

  //hash password
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  const updateData = {
    password: hashPassword,
  };
  await User.findOneAndUpdate({ _id: user.id }, updateData, { new: true });
};

const refreshToken = async (token: string) => {
  const decoded = jwtHelper.verifyToken(
    token,
    config.jwt.jwt_refresh_token_secret as string
  );
  const { id } = decoded;

  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not found');
  }

  //check verified and status
  if (!isExistUser.verified) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please verify your account, then try to login again'
    );
  }

  //check user status
  if (isExistUser.status === 'delete') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'It looks like your account has been deactivated.'
    );
  }

  const jwtPayload = {
    id: isExistUser._id,
    role: isExistUser.role,
    email: isExistUser.email,
  };
  //create token
  const accessToken = jwtHelper.createToken(
    jwtPayload,
    config.jwt.jwt_access_token_secret as Secret,
    config.jwt.access_token_expire_in as string
  );
  return { accessToken };
};

export const AuthService = {
  verifyEmailToDB,
  loginUserFromDB,
  forgetPasswordToDB,
  resetPasswordToDB,
  changePasswordToDB,
  resendOtpToDB,
  refreshToken,
};
