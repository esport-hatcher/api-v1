import { Model } from 'sequelize';

export default interface IUser extends Model {
  readonly id;
  username: string;
  email: string;
  avatarUrl: string;
  password: string;
  superAdmin: boolean;
}
