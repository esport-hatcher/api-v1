import { Model, DataTypes } from 'sequelize';
import db from '@db';
import { hash } from 'bcryptjs';
import { createHashtag } from '@utils/hashtagGenerator';
// import {
// 	HasManyGetAssociationsMixin,
// 	HasManyAddAssociationMixin,
// 	HasManyHasAssociationMixin,
// 	Association,
// 	HasManyCountAssociationsMixin,
// 	HasManyCreateAssociationMixin
// } from 'sequelize/lib/associations';

export default class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
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

export const initUser = (test: boolean = false) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
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
            hashtag: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            superAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
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
            sequelize: db.getDb(test),
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
};

initUser();
