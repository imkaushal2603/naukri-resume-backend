import { config } from "dotenv";

config();

export const PORT = Number(process.env.PORT) || 5000;
export const DATABASE_URL = process.env.DATABASE_URL || "mysql://root:@127.0.0.1:3306/naukri_resume";
export const DATABASE_USER = process.env.DATABASE_USER || "root";
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "password";
export const DATABASE_NAME = process.env.DATABASE_NAME || "naukri_resume";
export const DATABASE_HOST = process.env.DATABASE_HOST || "127.0.0.1";
export const DATABASE_PORT = Number(process.env.DATABASE_PORT) || 3306;
export const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY || "your_access_secret";
export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || "your_refresh_secret";
export const JWT_REFRESH_EXPIRES_DAYS = 14;
export const JWT_ACCESS_KEY_EXPIRES_IN = "1h";
export const JWT_REFRESH_KEY_EXPIRES_IN = `${JWT_REFRESH_EXPIRES_DAYS}d`;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "your_google_client_id";
export const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";