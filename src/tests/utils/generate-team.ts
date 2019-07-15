import * as faker from 'faker';

export const generateNormalTeam = () => {
    const team = {
        game: 'CSGO',
        region: faker.name.findName(),
        name: faker.address.country(),
    };
    return team;
};
