import { LolApi } from 'twisted';

export const sqlHost = process.env.SQL_HOST;
export const sqlUser = process.env.SQL_USER;
export const sqlPassword = process.env.SQL_PASSWORD;
export const sqlDb = process.env.SQL_DB;
export const sqlPort = parseInt(process.env.SQL_PORT);
export const jwtSecret = process.env.JWT_SECRET;
export const sequelizeLogs = Boolean(process.env.SEQUELIZE_LOGS);
export const lolApi = new LolApi({
    key: 'RGAPI-77674235-a981-4a43-a593-5836f0423f30',
});
