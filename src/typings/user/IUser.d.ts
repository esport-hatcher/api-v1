import { Model } from 'sequelize';

export default interface IUser extends IUserValues, Model {
  readonly id;
}

export interface IUserValues {
  username: string;
  email: string;
  avatarUrl: string;
  password: string;
  superAdmin: boolean;
}
