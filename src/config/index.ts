import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    frontend_url: process.env.FRONTEND_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    cloudinary: {
        cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    jwt: {
        jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
        jwt_access_expires: process.env.JWT_ACCESS_EXPIRES as string,
        jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
        jwt_refresh_expires: process.env.JWT_REFRESH_EXPIRES as string,
        reset_pass_secret: process.env.RESET_PASS_SECRET as string,
        reset_pass_expires: process.env.RESET_PASS_EXPIRES as string
    },
    open_router_key: process.env.OPENROUTERKEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    EMAIL_SENDER: {
        SMTP_HOST: process.env.SMTP_HOST as string,
        SMTP_PORT: process.env.SMTP_PORT as string,
        SMTP_USER: process.env.SMTP_USER as string,
        SMTP_PASS: process.env.SMTP_PASS as string,
        SMTP_FROM: process.env.SMTP_FROM as string
    },
}