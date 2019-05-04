import * as faker from 'faker';
import { IUserAttributes } from '@typings/user/IUser';

export const generateNormalUser = () => {
  const user: IUserAttributes = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    avatarUrl: faker.image.avatar(),
    superAdmin: false
  };
  return user;
};

export const generateBadEmail = () => {
  const badEmailUser: IUserAttributes = {
    email: 'test',
    username: faker.internet.userName(),
    password: faker.internet.password(),
    avatarUrl: faker.image.avatar(),
    superAdmin: false
  };
  return badEmailUser;
};

export const generateBadPwd = () => {
  const badPwdUser: IUserAttributes = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: 'test',
    avatarUrl: faker.image.avatar(),
    superAdmin: false
  };
  return badPwdUser;
};
