import { Model, DataTypes, Sequelize } from 'sequelize';

export default class EventTeam extends Model {
    public id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initEventTeam = (db: Sequelize) => {
    EventTeam.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
        },
        {
            tableName: 'EventTeams',
            sequelize: db,
        }
    );
};
