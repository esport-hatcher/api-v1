import User from '@models/User';
// tslint:disable-next-line: match-default-export-name
import { internet, name, helpers } from 'faker';

const users = [];

const getUser = () => {
    return {
        username: name.firstName(),
        email: internet.email(),
        avatarUrl: internet.avatar(),
        password: internet.password(),
        admin: helpers.randomize([true, false]),
    };
};

export const seedData = async (instances: number) => {
    for (let i = 0; i < instances; i++) {
        users.push(getUser());
    }
    return Promise.all([User.bulkCreate(users)]);
};
