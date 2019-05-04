import IUser, { IUserAttributes } from '@typings/user/IUser';
import User from '@models/User';

export default interface IUserFactory {
  create?: (data: IUserAttributes) => Promise<User>;
}
