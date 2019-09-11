import { sequelizeDb } from '@db';

jest.setTimeout(30000);
const OLD_ENV = process.env;

beforeAll(async () => {
    process.env = { ...OLD_ENV };
    if (process.env.NODE_ENV !== 'CI') {
        process.env.NODE_ENV = 'test';
    }
    return sequelizeDb.init(true, true);
});

afterAll(async () => {
    return sequelizeDb.close(true);
});
