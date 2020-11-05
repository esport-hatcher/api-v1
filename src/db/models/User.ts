import {
    Model,
    DataTypes,
    Sequelize,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationMixin,
} from 'sequelize';
import { hash } from 'bcryptjs';
import { encode } from 'jwt-simple';
import { createHashtag } from '@utils';
import { jwtSecret } from '@config';
import { Team, TeamUser, Event, EventUser, Task, TaskUser } from '@models';

// import {
// 	HasManyGetAssociationsMixin,
// 	HasManyAddAssociationMixin,
// 	HasManyHasAssociationMixin,
// 	Association,
// 	HasManyCountAssociationsMixin,
// 	HasManyCreateAssociationMixin
// } from 'sequelize/lib/associations';

export interface IUserProps {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    avatarUrl: string;
    superAdmin: boolean;
    hashtag?: string;
    country?: string;
    city?: string;
    phoneNumber?: string;
}
export class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public firstName: string;
    public lastName: string;
    public username!: string;
    public email!: string; // for nullable fields
    public avatarUrl: string;
    public country: string;
    public city: string;
    public phoneNumber: string;
    public password: string;
    public superAdmin: boolean;
    public hashtag: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public getTeams!: BelongsToManyGetAssociationsMixin<Team>;
    public getEvents!: BelongsToManyGetAssociationsMixin<Event>;
    public getTasks!: BelongsToManyGetAssociationsMixin<Task>;

    public addEvent!: BelongsToManyAddAssociationMixin<Event, EventUser>;
    public addTask!: BelongsToManyAddAssociationMixin<Task, TaskUser>;

    public TeamUser: TeamUser;
    public TaskUser: TaskUser;
    public EventUser: EventUser;

    getAccessToken() {
        const timestamp = new Date().getTime();
        return encode({ sub: this.id, iat: timestamp }, jwtSecret);
    }

    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.

    // public getProjects!: HasManyGetAssociationsMixin<Project>; // Note the null assertions!
    // public addProject!: HasManyAddAssociationMixin<Project, number>;
    // public hasProject!: HasManyHasAssociationMixin<Project, number>;
    // public countProjects!: HasManyCountAssociationsMixin;
    // public createProject!: HasManyCreateAssociationMixin<Project>;

    // // You can also pre-declare possible inclusions, these will only be populated if you
    // // actively include a relation.
    // public readonly projects?: Project[]; // Note this is optional since it's only populated when explicitly requested in code

    // public static associations: {
    // 	projects: Association<User, Project>;
    // };
}

export const initUser = (db: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            username: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            password: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avatarUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue:
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
            },
            superAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            hashtag: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: 'Users',
            sequelize: db,
        }
    );

    User.beforeCreate(async user => {
        const hashed = await hash(user.password, 10);
        user.password = hashed;
        return Promise.resolve();
    });
    User.afterCreate(async user => {
        user.hashtag = createHashtag(user.id);
        await user.save();
        return Promise.resolve();
    });

    User.beforeBulkCreate(async users => {
        for (const user of users) {
            const hashed = await hash(user.password, 10);
            user.password = hashed;
        }
        return Promise.resolve();
    });
};
