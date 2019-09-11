import {
    internet,
    helpers,
    address,
    company,
    random,
    phone,
    name,
} from 'faker';
import { User, Team } from '@models';
import { logger } from '@utils';

let usersDb: User[] = [];
let teamsDb: Team[] = [];

const getInstances = (functionToExecute: Function, instances: number) => {
    const data = [];
    for (let i = 0; i < instances; i++) {
        data.push(functionToExecute());
    }
    return data;
};

const getUser = () => {
    const firstName = name.firstName();
    const lastName = name.lastName();
    return {
        username: internet.userName(firstName, lastName),
        email: internet.email(firstName, lastName),
        avatarUrl: internet.avatar(),
        password: internet.password(),
        superAdmin: helpers.randomize([true, false]),
        country: address.country(),
        city: address.city(),
        phoneNumber: phone.phoneNumber(),
    };
};

const getTeamUser = async () => {
    return teamsDb[random.number({ min: 1, max: teamsDb.length }) - 1].addUser(
        usersDb[random.number({ min: 1, max: usersDb.length }) - 1],
        {
            through: {
                role: helpers.randomize(['Admin', 'Staff', 'Player', 'Owner']),
                playerStatus: helpers.randomize(['true', 'false']),
                teamStatus: helpers.randomize(['true', 'false']),
            },
        }
    );
};

const getTeam = () => {
    return {
        name: company.companyName(),
        region: address.countryCode(),
        game: helpers.randomize([
            'Counter Strike',
            'League of Legends',
            'Fortnite',
            'Apex Legends',
            'Rainbow 6 Siege',
            'World of Warcraft',
        ]),
    };
};

const seedUsers = async (instances: number) => {
    const users = getInstances(getUser, instances);
    usersDb = await User.bulkCreate(users);
    // console.log('records user:', usersDb);
};

const seedTeams = async (instances: number) => {
    const teams = getInstances(getTeam, instances);
    teamsDb = await Team.bulkCreate(teams);
};

const seedTeamsUsers = async (instances: number) => {
    const teamUsers = getInstances(getTeamUser, instances);
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
