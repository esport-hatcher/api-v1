import {
    Model,
    DataTypes,
    Sequelize,
    BelongsToCreateAssociationMixin,
} from 'sequelize';
import { Team } from '@models';

export interface IClubProps {
    name: string;
    avatarClubUrl?: string;
    bannerUrl?: string;
}
export class Club extends Model {
    public id!: number;
    public name!: string;
    public avatarClubUrl: string;
    public bannerUrl: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public createTeam!: BelongsToCreateAssociationMixin<Team>;
}

export const initClub = (db: Sequelize) => {
    Club.init(
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
            avatarClubUrl: {
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
            tableName: 'Clubs',
            sequelize: db,
        }
    );
};
