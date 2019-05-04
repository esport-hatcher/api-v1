import { Model } from 'sequelize';

export default interface IUser extends IUserAttributes, Model {
  readonly id;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAttributes {
  username: string;
  email: string;
  avatarUrl: string;
  password: string;
  superAdmin: boolean;
}
