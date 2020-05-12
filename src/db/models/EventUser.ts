import { Model, DataTypes, Sequelize } from 'sequelize';

export class EventUser extends Model {
    public id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initEventUser = (db: Sequelize) => {
    EventUser.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
        },
        {
            tableName: 'EventUsers',
            sequelize: db,
        }
    );
};
