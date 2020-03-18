import { Model, DataTypes, Sequelize } from 'sequelize';

export class TaskUser extends Model {
    public id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initTaskUser = (db: Sequelize) => {
    TaskUser.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
        },
        {
            tableName: 'TaskUsers',
            sequelize: db,
        }
    );
};
