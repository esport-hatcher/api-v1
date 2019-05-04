import * as Sequelize from 'sequelize';
import * as bcrypt from 'bcryptjs';
import { db } from '@utils/database';
import IUser from '@typings/user/IUser';

type UserModelStatic = typeof Sequelize.Model & {
  new (values?: object, options?: Sequelize.BuildOptions): IUser;
};

const User = <UserModelStatic>db.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  avatarUrl: {
    type: Sequelize.STRING,
    defaultValue:
      'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png'
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  superAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

User.beforeCreate(async user => {
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  return Promise.resolve();
});

export default User;
