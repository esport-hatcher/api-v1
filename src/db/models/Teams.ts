import { Model, DataTypes } from 'sequelize';
import db from '@db';

export default class Teams extends Model {
    public id!: number;
    public teamName!: string;
    public game!: string;
    public region!: string;
    public avatarTeamUrl: string;
    public annierUrl: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initTeams = (test: boolean = false) => {
    Teams.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            ownerId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            name: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            game: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            region: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avatarTeamUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue:
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
            },
            bannierUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue:
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
            },
        },
        {
            tableName: 'Teams',
            sequelize: db.getDb(test),
        }
    );
};

initTeams();
