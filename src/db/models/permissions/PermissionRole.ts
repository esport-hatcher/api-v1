import { Model, DataTypes, Sequelize } from 'sequelize';

export class PermissionRole extends Model {
    public id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initPermissionRole = (db: Sequelize) => {
    PermissionRole.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
        },
        {
            tableName: 'PermissionRoles',
            sequelize: db,
        }
    );
};
