import { Model, DataTypes } from 'sequelize';
import db from '@db';

export default class Members extends Model {
    public id!: number;
    public nameMember!: string;
    public playerStatus!: boolean;
    public teamStatus!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initMembers = (test: boolean = false) => {
    Members.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            teamId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },

            teamStatus: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'Members',
            sequelize: db.getDb(test),
        }
    );
};

initMembers();
