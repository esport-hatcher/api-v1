import { db } from '@db';

jest.setTimeout(30000);

beforeAll(async () => {
    await db.authenticate();
});

afterAll(async () => {
    await db.close();
});
