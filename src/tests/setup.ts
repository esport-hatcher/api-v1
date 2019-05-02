import sequelize from '@utils/database';
import { db } from '@utils/database';

jest.setTimeout(30000);

require('iconv-lite').encodingExists('foo');

beforeAll(async () => {
  await sequelize(true);
});

afterAll(async () => {
  await db.close();
});
