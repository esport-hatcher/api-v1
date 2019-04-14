import IUserFactory from '../typings/user/userFactory';
import userType from '../typings/user/userType';
import User from '../models/User';
import { checkIfEmail, checkIfMinAndMax } from '../utils/validators';

class userFactory implements IUserFactory {
  async create(data: userType) {
    try {
      if (
        !checkIfEmail(data.email) ||
        !checkIfMinAndMax(data.password, { min: 5, max: 20 })
      ) {
        return Promise.reject("Validation doesn't pass");
      }
      const user: userType = await User.findOne({
        where: { email: data.email }
      });
      if (user) {
        return Promise.reject('User already exist');
      }
      const newUser: userType = await User.create({
        email: data.email,
        username: data.username,
        avatarUrl: data.avatarUrl,
        password: data.password
      });
      return newUser;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new userFactory();
