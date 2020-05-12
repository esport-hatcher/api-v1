import {
    Model,
    DataTypes,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    Sequelize,
    HasManyCreateAssociationMixin,
} from 'sequelize';
import { User, TeamUser, Event, Task } from '@models';

export interface ITeamProps {
    name: string;
    game: string;
    region: string;
    avatarTeamUrl?: string;
    bannerUrl?: string;
}
export class Team extends Model {
    public id!: number;
    public name!: string;
    public game!: string;
    public region!: string;
    public avatarTeamUrl: string;
    public bannerUrl: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public addUser!: BelongsToManyAddAssociationMixin<User, TeamUser>;
    public getUsers!: BelongsToManyGetAssociationsMixin<User>;
    public createEvent!: HasManyCreateAssociationMixin<Event>;
    public createTask!: HasManyCreateAssociationMixin<Task>;

    async addPlayer(newPlayer: User) {
        return this.addUser(newPlayer, {
            through: {
                role: 'Player',
                teamStatus: true,
                playerStatus: true,
            },
        });
    }

    async addAdmin(newAdmin: User) {
        return this.addUser(newAdmin, {
            through: {
                role: 'Admin',
                teamStatus: true,
                playerStatus: true,
            },
        });
    }
}

export const initTeam = (db: Sequelize) => {
    Team.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
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
                allowNull: true,
                defaultValue:
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
            },
            bannerUrl: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue:
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
            },
        },
        {
            tableName: 'Teams',
            sequelize: db,
        }
    );
};
