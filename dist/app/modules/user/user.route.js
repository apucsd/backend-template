"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get('/profile', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.USER), user_controller_1.UserController.getUserProfile);
//create a new user
router.route('/create-user').post((0, validateRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.UserController.createUser);
//create a new admin
router
    .route('/create-admin')
    .post((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.UserController.createAdmin);
//create a new super admin
// router
//     .route('/create-super-admin')
//     .post(validateRequest(UserValidation.createUserZodSchema), UserController.createSuperAdmin);
// //update user status
router
    .route('/update-status/:id')
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), (0, validateRequest_1.default)(user_validation_1.UserValidation.userStatusZodSchema), user_controller_1.UserController.updateStatus);
// update user profile
router
    .route('/update-profile')
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.USER), (0, fileUploadHandler_1.default)(), user_controller_1.UserController.updateProfile);
// get all users
router.route('/all-user').get(user_controller_1.UserController.getAllUsers);
// get all admins
router.route('/all-admin').get((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN), user_controller_1.UserController.getAllAdmin);
//get single user by id
router.route('/:id').get((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.USER), user_controller_1.UserController.getUserById);
//  delete user account
router.route('/').patch((0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.USER), user_controller_1.UserController.deleteAccount);
exports.UserRoutes = router;
