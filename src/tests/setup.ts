import db from '@db';
import { initUser } from '@models/User';
import { initTeam } from '@models/Team';
import { initTeamUser } from '@models/TeamUser';
// import { initTeamUser } from '@models/TeamUser';

jest.setTimeout(30000);
const OLD_ENV = process.env;

beforeAll(async () => {
    process.env = { ...OLD_ENV };
    if (process.env.NODE_ENV !== 'CI') {
        process.env.NODE_ENV = 'test';
    }
    initUser(true);
    initTeam(true);
    initTeamUser(true);
    await db.init(true, true);
});

afterAll(async () => {
    await db.close(true);
});
