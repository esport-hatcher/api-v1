import { Model, DataTypes, Sequelize } from 'sequelize';

export class PermissionAction extends Model {
    public id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initPermissionAction = (db: Sequelize) => {
    PermissionAction.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
        },
        {
            tableName: 'PermissionAction',
            sequelize: db,
        }
    );
};
