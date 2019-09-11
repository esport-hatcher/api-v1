import { helpers } from 'faker';
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
    const users = getInstances(
        () => getRandomUserProps(helpers.randomize([true, false])),
        instances
    );
    usersDb = await User.bulkCreate(users);
};

const seedTeams = async (instances: number) => {
    const teams = getInstances(getRandomTeamProps, instances);
    teamsDb = await Team.bulkCreate(teams);
};

const seedTeamsUsers = async (instances: number) => {
    const teamUsers = getInstances(
        () => getRandomTeamUser(teamsDb, usersDb),
        instances
    );
    return Promise.all(teamUsers);
};

export const seedData = async (instances: number = 50) => {
    logger('Seeders', `Trying to seed ${instances} instances...`);
    try {
        await seedUsers(instances);
        await seedTeams(instances);
        await seedTeamsUsers(instances);
        logger('Seeders', `Successfully seeded ${instances} instances.`);
    } catch (err) {
        logger(
            'Seeders',
            `
            Failed to seed ${instances} instances.
            Reason: ${err}
            The seeding may have worked partially. Try putting a lower value to instances
        `
        );
    }
};
