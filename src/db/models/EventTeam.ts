import { Model, DataTypes, Sequelize, ENUM } from 'sequelize';

export default class EventTeam extends Model {
    public id!: number;
    public teamStatus!: boolean;
    public eventStatus!: boolean;
    public role!: string;
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
            role: {
                type: ENUM('Admin', 'Staff', 'Player', 'Owner'),
                allowNull: false,
            },
        },
        {
            tableName: 'EventTeams',
            sequelize: db,
        }
    );
};
