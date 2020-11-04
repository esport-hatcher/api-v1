import { Model, DataTypes, Sequelize, ENUM } from 'sequelize';
import { getRandomLightColor } from '@utils';

export type TeamUserRole = 'Admin' | 'Staff' | 'Player' | 'Owner';

export class TeamUser extends Model {
    public id!: number;
    public playerStatus!: boolean;
    public teamStatus!: boolean;
    public role!: TeamUserRole;
    public color!: string;
    public lolSummonerName: string;
    public lolRegion: string;
    public twitchUsername: string;
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
            lolSummonerName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lolRegion: {
                type: ENUM(
                    'BRAZIL',
                    'EU_EAST',
                    'EU_WEST',
                    'KOREA',
                    'LAT_NORT',
                    'LAT_SOUTH',
                    'AMERICA_NORTH',
                    'OCEANIA',
                    'TURKEY',
                    'RUSSIA',
                    'JAPAN',
                    'PBE'
                ),
                allowNull: false,
                defaultValue: 'EU_WEST',
            },
            twitchUsername: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            hooks: {
                beforeBulkCreate: TeamUser => {
                    for (const teamUser of TeamUser) {
                        teamUser.color = getRandomLightColor();
                    }
                },
            },
            tableName: 'TeamUsers',
            sequelize: db,
        }
    );
};
