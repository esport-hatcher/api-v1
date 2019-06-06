import { db } from '@db';

jest.setTimeout(30000);
const OLD_ENV = process.env;

beforeAll(async () => {
    await db.authenticate();
    jest.resetModules(); // this is important - it clears the cache
    process.env = { ...OLD_ENV };
    process.env.NODE_ENV = 'CI';
});

afterAll(async () => {
    await db.close();
    process.env.NODE_ENV = 'DEV';
});
