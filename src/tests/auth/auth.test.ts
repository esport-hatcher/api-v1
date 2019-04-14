import userFactory from '../../factories/userFactory';
import { generateNormalUser } from '../utils/generate-user';
import userType from '../../typings/user/userType';

describe('when a user register', () => {
  const newUser = generateNormalUser();

  void it('should create a new account', async () => {
    const user = await userFactory.create(newUser);
    expect(user).toBeDefined();
  });

  void it('should not be able to create another account with the same email', async () => {
    await expect(userFactory.create(newUser)).rejects.toMatch(
      'User already exist'
    );
  });

  void it('should not be able to create an account with an incorrect email', async () => {
    const incorrectEmail: userType = {
      username: 'test',
      email: 'test',
      password: 'test12345',
      avatarUrl: 'test',
      superAdmin: false
    };
    await expect(userFactory.create(incorrectEmail)).rejects.toMatch(
      "Validation doesn't pass"
    );
  });

  void it('should not be able to create an account with an incorrect password', async () => {
    const incorrectPwd: userType = {
      username: 'test',
      email: 'test@test.com',
      password: 'test',
      avatarUrl: 'test',
      superAdmin: false
    };
    await expect(userFactory.create(incorrectPwd)).rejects.toMatch(
      "Validation doesn't pass"
    );
  });
});
