import {
    Model,
    DataTypes,
    Sequelize,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import { User, TaskUser } from '@models';

export interface ITaskProps {
    title: string;
    description?: string;
    dateBegin?: Date;
    dateEnd: Date;
    completed?: boolean;
}

export class Task extends Model {
    public id!: number;
    public title!: string;
    public description: string;
    public dateBegin: Date;
    public dateEnd!: Date;
    public completed: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public addUser!: BelongsToManyAddAssociationMixin<User, TaskUser>;
    public getUsers!: BelongsToManyGetAssociationsMixin<User>;
}

export const initTask = (db: Sequelize) => {
    Task.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: '',
            },
            dateBegin: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(),
            },
            dateEnd: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            completed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: 'Tasks',
            sequelize: db,
        }
    );
};
