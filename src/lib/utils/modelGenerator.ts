import {
    internet,
    helpers,
    address,
    company,
    phone,
    name,
    random,
} from 'faker';
import { User, IUserProps, Team, ITeamProps } from '@models';

export const getRandomUserProps = (superAdmin: boolean = false): IUserProps => {
    const firstName = name.firstName();
    const lastName = name.lastName();
    return {
        firstName,
        lastName,
        username: internet.userName(firstName, lastName),
        email: internet.email(firstName, lastName),
        avatarUrl: internet.avatar(),
        password: internet.password(),
        superAdmin,
        country: address.country(),
        city: address.city(),
        phoneNumber: phone.phoneNumber(),
    };
};

export const getRandomTeamProps = (): ITeamProps => {
    return {
        name: company.companyName(),
        region: address.countryCode(),
        avatarTeamUrl:
            'https://upload.wikimedia.org/wikipedia/fr/thumb/3/36/Fnatic_Logo.svg/1200px-Fnatic_Logo.svg.png',
        bannerUrl:
            'https://image.redbull.com/rbcom/010/2016-11-19/1331830255276_2/0012/0/46/0/721/1199/1050/1/fnatic-esports-league-of-legends-2017-equipe.jpg',
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

export const getRandomTeamUser = async (teams: Team[], users: User[]) => {
    return teams[random.number({ min: 1, max: teams.length }) - 1].addUser(
        users[random.number({ min: 1, max: users.length }) - 1],
        {
            through: {
                role: helpers.randomize(['Admin', 'Staff', 'Player', 'Owner']),
                playerStatus: helpers.randomize(['true', 'false']),
                teamStatus: helpers.randomize(['true', 'false']),
            },
        }
    );
};

export const getUser = async (superAdmin: boolean = false): Promise<User> => {
    const user = getRandomUserProps(superAdmin);
    return User.create(user);
};
