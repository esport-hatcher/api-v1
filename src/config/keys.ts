export const sqlHost = process.env.SQL_HOST;
export const sqlUser = process.env.SQL_USER;
export const sqlPassword = process.env.SQL_PASSWORD;
export const sqlDb = process.env.SQL_DB;
export const sqlPort = parseInt(process.env.SQL_PORT);
export const jwtSecret = process.env.JWT_SECRET;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const SEQUELIZE_LOGS = Boolean(process.env.SEQUELIZE_LOGS);

let AWS_ACCESS_KEY: string;
let AWS_SECRET_KEY: string;

if (process.env.NODE_ENV === 'development') {
    // tslint:disable-next-line: no-require-imports
    const LOCAL_KEYS = require('./secretKeys');
    AWS_ACCESS_KEY = LOCAL_KEYS.AWS_ACCESS_KEY;
    AWS_SECRET_KEY = LOCAL_KEYS.AWS_SECRET_KEY;
} else {
    AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
    AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
}

export { AWS_ACCESS_KEY, AWS_SECRET_KEY };
