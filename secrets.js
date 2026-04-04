import dotenv from 'dotenv';

dotenv.config();

export const secret = process.env.JWT_SECRET;

export const dbconfig = process.env.DATABASE_URL;

export default secret;
