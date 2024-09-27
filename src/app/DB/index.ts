import config from '../../config';
import { USER_ROLES } from '../../enums/user';
import { User } from '../modules/user/user.model';

const superAdmin = {
    name: config.super_admin_name,
    role: USER_ROLES.SUPER_ADMIN,
    email: config.super_admin_email,
    password: config.super_admin_password,
    profile: 'https://i.ibb.co/z5YHLV9/profile.png',
    status: 'active',
    verified: true,
};

const seedSuperAdmin = async () => {
    const isExistSuperAdmin = await User.findOne({ role: USER_ROLES.SUPER_ADMIN });
    if (!isExistSuperAdmin) {
        await User.create(superAdmin);
    }
};

export default seedSuperAdmin;
