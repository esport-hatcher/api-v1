import userFactory from '../../factories/userFactory';
import { generateNormalUser } from '../utils/generate-user';


describe('when a user register', () => {
	const newUser = generateNormalUser();
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
