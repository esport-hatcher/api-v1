import {
    Model,
    DataTypes,
    Sequelize,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyRemoveAssociationMixin,
} from 'sequelize';
import { Role, PermissionRole, Action, PermissionAction } from '@models';

export interface IPermissionProps {
    scope: string;
    primary: boolean;
}

export class Permission extends Model {
    public id!: number;
    public scope!: string;
    public primary!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getRoles!: HasManyGetAssociationsMixin<Role>;
    public addRole!: HasManyAddAssociationMixin<Role, PermissionRole>;
    public removeRole!: HasManyRemoveAssociationMixin<Role, PermissionRole>;
    public getActions!: HasManyGetAssociationsMixin<Action>;
    public addAction!: HasManyAddAssociationMixin<Action, PermissionAction>;
    public removeAction!: HasManyRemoveAssociationMixin<
        Action,
        PermissionAction
    >;

    public addActionByName(actionName: string) {
        Action.findOne({
            where: { action: actionName },
        }).then(actionResult => {
            if (actionResult && actionResult[0]) {
                this.addAction(actionResult[0]);
            }
        });
    }
}

export const initPermission = (db: Sequelize) => {
    Permission.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            scope: {
                type: new DataTypes.STRING(256),
                allowNull: false,
            },
            primary: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'Permissions',
            sequelize: db,
        }
    );
};
