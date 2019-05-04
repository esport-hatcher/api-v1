import User from '@models/User';
import { checkIfEmail, checkIfMinAndMax } from '@utils/validators';
import IUserFactory from '@typings/user/IUserFactory';
import { IUserAttributes } from '@typings/user/IUser';

class userFactory implements IUserFactory {
  async create(data: IUserAttributes) {
    try {
      if (
        !checkIfEmail(data.email) ||
        !checkIfMinAndMax(data.password, { min: 5, max: 20 })
      ) {
        return Promise.reject({
          statusCode: 422,
          message: "Validation doesn't pass"
        });
      }
      const user = await User.findOne({
        where: { email: data.email }
      });
      if (user) {
        return Promise.reject({
          statusCode: 410,
          message: 'User already exist'
        });
      }
      const newUser = await User.create({
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
