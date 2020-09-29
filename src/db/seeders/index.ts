import { User, Team } from '@models';
import {
    logger,
    getRandomTeamProps,
    getRandomUserProps,
    getRandomTeamUser,
} from '@utils';

let usersDb: User[] = [];
let teamsDb: Team[] = [];

const getInstances = (functionToExecute: Function, instances: number) => {
    const data = [];
    for (let i = 0; i < instances; i++) {
        data.push(functionToExecute());
    }
    return data;
};

const seedUsers = async (instances: number) => {
    const { BO_ADMIN_PWD } = process.env;

    const users = getInstances(() => getRandomUserProps(false), instances);
    usersDb = await User.bulkCreate([
        {
            firstName: 'admin',
            lastName: 'admin',
            username: 'admin',
            password: BO_ADMIN_PWD,
            email: 'admin@esport-hatcher.com',
            superAdmin: true,
            country: 'France',
            city: 'Paris',
            phoneNumber: '3300000000',
        },
        ...users,
    ]);
};

const seedTeams = async (instances: number) => {
    const teams = getInstances(getRandomTeamProps, instances / 4);
    teamsDb = await Team.bulkCreate(teams);
};

const seedTeamsUsers = async (instances: number) => {
    const teamUsers = getInstances(
        () => getRandomTeamUser(teamsDb, usersDb),
        instances * 4
    );
    return Promise.all(teamUsers);
};

export const seedData = async (instances: number = 50) => {
    logger('Seeders', `Trying to seed ${instances} instances...`);
    await seedUsers(instances);
    await seedTeams(instances);
    await seedTeamsUsers(instances);
    logger('Seeders', `Successfully seeded ${instances} instances.`);
};
