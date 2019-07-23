import * as faker from 'faker';
import app from '@app';
import IUser from '@typings/user/IUser';
import userFactory from '@factories/userFactory';
import * as request from 'supertest';
import User from '@models/User';

export const getAdminUserTemplate = () => {
    const user: IUser = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        avatarUrl: faker.image.avatar(),
        superAdmin: true,
    };
    return user;
};

export const getNormalUserTemplate = () => {
    const user: IUser = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        avatarUrl: faker.image.avatar(),
        superAdmin: false,
    };
    return user;
};

export const generateBadEmail = () => {
    const badEmailUser: IUser = {
        email: 'test',
        username: faker.internet.userName(),
        password: faker.internet.password(),
        avatarUrl: faker.image.avatar(),
        superAdmin: false,
    };
    return badEmailUser;
};

export const generateBadPwd = () => {
    const badPwdUser: IUser = {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: 'test',
        avatarUrl: faker.image.avatar(),
        superAdmin: false,
    };
    return badPwdUser;
};

export const getTeamTemplate = () => {
    return {
        region: 'FR',
        name: faker.name.jobTitle(),
        game: faker.name.jobType(),
    };
};

export const getNormalUser = async () => {
    const user = getNormalUserTemplate();
    return userFactory.create(user);
};

export const getAdminUser = async () => {
    const user = getAdminUserTemplate();
    return userFactory.create(user);
};

export const getTeam = async (user: User) => {
    const { body } = await request(app)
        .post('/teams')
        .send(getTeamTemplate())
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${user.getAccessToken()}`);
    return body;
};
