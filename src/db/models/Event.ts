import { Model, DataTypes, Sequelize } from 'sequelize';

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
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
                type: DataTypes.STRING,
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
