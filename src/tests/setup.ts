import db from '@db';
import { initUser } from '@models/User';

jest.setTimeout(30000);
const OLD_ENV = process.env;

beforeAll(async () => {
    process.env = { ...OLD_ENV };
    if (process.env.NODE_ENV !== 'CI') {
        process.env.NODE_ENV = 'test';
    }
    initUser(true);
    return db.init(true, true);
});

afterAll(async () => {
    return db.close(true);
});
