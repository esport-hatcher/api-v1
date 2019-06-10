import db from '@db';
import { initUser } from '../db/models/User';

jest.setTimeout(30000);
const OLD_ENV = process.env;

beforeAll(async () => {
    initUser(true);
    process.env = { ...OLD_ENV };
    if (process.env.NODE_ENV !== 'CI') {
        process.env.NODE_ENV = 'test';
    }
    await db.init(true, true);
});

afterAll(async () => {
    process.env.NODE_ENV = 'dev';
    await db.close(true);
});
