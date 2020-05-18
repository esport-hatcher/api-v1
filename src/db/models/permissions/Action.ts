import { Model, DataTypes, Sequelize } from 'sequelize';

export interface IActionProps {
    action: string;
    label: string;
    primary: boolean;
}

export class Action extends Model {
    public id!: number;
    public action!: string;
    public label!: string;
    public requireAuth!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initAction = (db: Sequelize) => {
    Action.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            action: {
                type: new DataTypes.STRING(128),
                unique: true,
                allowNull: false,
            },
            label: {
                type: DataTypes.STRING(128),
                unique: true,
                allowNull: true,
            },
            requireAuth: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: 'Actions',
            sequelize: db,
        }
    );
};
