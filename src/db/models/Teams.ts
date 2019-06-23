import { Model, DataTypes } from 'sequelize';
import db from '@db';

export default class Teams extends Model {
    public id!: number;
    public teamName!: string;
    public game!: string;
    public region!: string;
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
            teamName: {
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
        },
        {
            tableName: 'Teams',
            sequelize: db.getDb(test),
        }
    );
};

initTeams();
