import db from '@db';
import { initUser } from '@models/User';

jest.setTimeout(30000);
const OLD_ENV = process.env;

beforeAll(async () => {
    process.env = { ...OLD_ENV };
    if (process.env.NODE_ENV !== 'CI') {
        process.env.NODE_ENV = 'test';
        initUser(process.env.NODE_ENV === 'test');
        return db.init(true, process.env.NODE_ENV === 'test');
    }
    return db.init(true);
});

afterAll(async () => {
    if (process.env.NODE_ENV !== 'CI') {
        return db.close(process.env.NODE_ENV === 'test');
    }
    return db.close();
});
