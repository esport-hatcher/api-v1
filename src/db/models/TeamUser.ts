import { Model, DataTypes, Sequelize, ENUM } from 'sequelize';
import { getRandomLightColor } from '@utils';

export type TeamUserRole = 'Admin' | 'Staff' | 'Player' | 'Owner';

export class TeamUser extends Model {
    public id!: number;
    public playerStatus!: boolean;
    public teamStatus!: boolean;
    public role!: TeamUserRole;
    public color!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initTeamUser = (db: Sequelize) => {
    TeamUser.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            playerStatus: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            teamStatus: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            role: {
                type: ENUM('Admin', 'Staff', 'Player', 'Owner'),
                allowNull: false,
                defaultValue: 'Player',
            },
            color: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: getRandomLightColor(),
            },
        },
        {
            tableName: 'TeamUsers',
            sequelize: db,
        }
    );
};
