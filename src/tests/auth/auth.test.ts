import * as faker from 'faker';
import userFactory from '../../factories/userFactory';
import userType from '../../typings/userType';

describe('when a user register', () => {
	const newUser: userType = {
		email: faker.internet.email(),
		username: faker.internet.userName(),
		password: faker.internet.password(),
		avatarUrl: faker.image.avatar(),
		superAdmin: false
	};
	void it('should create a new account', done => {
		userFactory.create(newUser).then(user => {
			expect(user.username).toEqual(newUser.username);
			done();
		});
	});
	void it('should not be able to create another account with the same email', done => {
		userFactory.create(newUser).then(user => {
			expect(user).toBeNull();
			done();
		});
	});
});
