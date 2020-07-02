import {
    Model,
    DataTypes,
    Sequelize,
    BelongsToSetAssociationMixin,
} from 'sequelize';
import { Team } from '@models';

export class RoleUser extends Model {
    public id!: number;
    public RoleId!: number;
    public UserId!: number;
    public TeamId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public setTeam!: BelongsToSetAssociationMixin<Team, string>;
}

export const initRoleUser = (db: Sequelize) => {
    RoleUser.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
        },
        {
            tableName: 'RoleUsers',
            sequelize: db,
        }
    );
};
