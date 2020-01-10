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
    description: string;
    deadline: Date;
    dateBegin: Date;
    dateEnd: Date;
}

export class Task extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public deadline!: Date;
    public dateBegin!: Date;
    public dateEnd!: Date;
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
                type: DataTypes.STRING,
                allowNull: false,
            },
            deadline: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            dateBegin: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            dateEnd: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            tableName: 'Tasks',
            sequelize: db,
        }
    );
};
