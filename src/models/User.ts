import { Table, Column, Model, BeforeCreate } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';

@Table({
  timestamps: true
})
export default class User extends Model<User> {
  @Column({
    allowNull: false
  })
  username: string;

  @Column({
    allowNull: false,
    unique: true
  })
  email: string;

  @Column({
    allowNull: false,
    defaultValue: 'google.com'
  })
  avatarUrl: string;

  @Column({
    allowNull: false
  })
  password: string;

  @Column({
    defaultValue: false
  })
  superAdmin: false;

  @BeforeCreate
  static async hashPassword(instance: User) {
    const hash = await bcrypt.hash(instance.password, 10);
    instance.password = hash;
  }
}
