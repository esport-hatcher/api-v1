import {
    Model,
    DataTypes,
    Sequelize,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
} from 'sequelize';
import {
    User,
    TeamUser,
    Event,
    Task,
    Role,
    RoleUser,
    Action,
    Permission,
} from '@models';

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

    // Permissions
    // Roles
    public getRoleUsers!: HasManyGetAssociationsMixin<RoleUser>;
    public createRole!: HasManyCreateAssociationMixin<Role>;
    public getRoles!: HasManyGetAssociationsMixin<Role>;
    // Actions
    public createAction!: HasManyCreateAssociationMixin<Action>;
    public getActions!: HasManyGetAssociationsMixin<Action>;
    // Permissions
    public createPermission!: HasManyCreateAssociationMixin<Permission>;
    public getPermissions!: HasManyGetAssociationsMixin<Permission>;

    public async findRoleByUser(user: User): Promise<Role> {
        const roleUsers: RoleUser[] = await this.getRoleUsers();
        let role: Promise<Role> = null;

        roleUsers.forEach((roleUser: RoleUser) => {
            if (roleUser.UserId === user.id) {
                role = Role.findByPk(roleUser.RoleId);
            }
        });

        return role;
    }

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
