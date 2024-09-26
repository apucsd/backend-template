import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    ip_address: process.env.IP_ADDRESS,
    database_url: process.env.DATABASE_URL,
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    stripe_secret_key: process.env.stripe_secret_key,
    jwt: {
        jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        access_token_expire_in: process.env.JWT_ACCESS_TOKEN_EXPIRED_IN,
        refresh_token_expire_in: process.env.JWT_REFRESH_TOKEN_EXPIRED_IN,
    },
    email: {
        from: process.env.EMAIL_FROM,
        user: process.env.EMAIL_USER,
        port: process.env.EMAIL_PORT,
        host: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASS,
    },
};
