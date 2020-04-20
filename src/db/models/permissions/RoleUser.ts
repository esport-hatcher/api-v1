import { Model, DataTypes, Sequelize } from 'sequelize';

export class RoleUser extends Model {
    public id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initRoleUser = (db: Sequelize) => {
    RoleUser.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
        },
        {
            tableName: 'RoleUsers',
            sequelize: db,
        }
    );
};
