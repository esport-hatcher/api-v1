import { sqlDb, sqlHost, sqlPassword, sqlPort, sqlUser } from '@config/keys';
import { Sequelize } from 'sequelize';

const { NODE_ENV, SEQUELIZE_LOGS } = process.env;

export const db = new Sequelize(sqlDb, sqlUser, sqlPassword, {
    dialect: 'mysql',
    host: sqlHost,
    port: sqlPort,
    logging:
        NODE_ENV === 'PROD' || NODE_ENV === 'CI'
            ? false
            : SEQUELIZE_LOGS === 'false'
            ? false
            : true,
});

export default async (force: boolean = false) => {
    try {
        await db.authenticate();
        // tslint:disable-next-line: no-console
        console.log('Connected to database successfully...');
        await db.sync({ force });
    } catch (error) {
        throw new Error('Unable to connect to database...');
    }
};
