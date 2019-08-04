import {
    Model,
    DataTypes,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    Sequelize,
} from 'sequelize';
import Team from '@models/Team';
import TeamEvent from '@models/TeamEvent';

export default class Event extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public from!: Date;
    public to!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public addTeam!: BelongsToManyAddAssociationMixin<Team, TeamEvent>;
    public getTeams!: BelongsToManyGetAssociationsMixin<Team>;
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
            from: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            to: {
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
