import * as faker from 'faker';
import userType from '../../typings/user/userType';

export const generateNormalUser = () => {
	const user: userType = {
		email: faker.internet.email(),
		username: faker.internet.userName(),
		password: faker.internet.password(),
		avatarUrl: faker.image.avatar(),
		superAdmin: false
	};
	return user;
};
