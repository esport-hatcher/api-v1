import userFactory from '../../factories/userFactory';
import userType from '../../typings/userType';

describe('when a user register', () => {
	const newUser: userType = {
		email: 'test@test.com',
		username: 'test',
		password: 'justatest',
		avatarUrl: 'none',
		superAdmin: false
	};
	it('should create a new account', done => {
		userFactory.create(newUser).then(user => {
			expect(user.username).toEqual('test');
			done();
		});
	});
	it('should not be able to create another account with the same email', done => {
		userFactory.create(newUser).then(user => {
			expect(user).toBeNull();
			done();
		});
	});
});
