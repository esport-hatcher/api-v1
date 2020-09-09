import {
    Model,
    DataTypes,
    Sequelize,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import { User, EventUser } from '@models';
export interface IEventProps {
    title: string;
    description: string;
    place: string;
    dateBegin: Date;
    dateEnd: Date;
}

export class Event extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public place!: string;
    public dateBegin!: Date;
    public dateEnd!: Date;
    public readonly TeamId: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public addUser!: BelongsToManyAddAssociationMixin<User, EventUser>;
    public getUsers!: BelongsToManyGetAssociationsMixin<User>;
}

export const initEvent = (db: Sequelize) => {
    Event.init(
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
                allowNull: false,
            },
            place: {
                type: DataTypes.STRING,
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
            tableName: 'Events',
            sequelize: db,
        }
    );
};
