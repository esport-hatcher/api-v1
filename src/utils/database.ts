import { sqlDb, sqlHost, sqlPassword, sqlPort, sqlUser } from '../keys';
import * as Sequelize from 'sequelize';

export const db = new Sequelize.Sequelize(sqlDb, sqlUser, sqlPassword, {
  dialect: 'mysql',
  host: sqlHost,
  port: sqlPort
});

export default async (force?: boolean) => {
  try {
    await db.authenticate();
    console.log('Connected to database successfully...');

    if (force) {
      await db.sync({ force: true });
    } else {
      await db.sync();
    }
  } catch (error) {
    throw new Error('Unable to connect to database...');
  }
};
