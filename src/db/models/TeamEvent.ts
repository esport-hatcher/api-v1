import { Model, DataTypes, Sequelize } from 'sequelize';

export default class TeamEvent extends Model {
    public id!: number;
    public teamStatus!: boolean;
    public eventStatus!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initTeamEvent = (db: Sequelize) => {
    TeamEvent.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            teamStatus: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            eventStatus: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: 'TeamEvents',
            sequelize: db,
        }
    );
};
