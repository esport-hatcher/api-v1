import {
    Model,
    DataTypes,
    Sequelize,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyRemoveAssociationMixin,
    HasOneSetAssociationMixin,
    HasOneGetAssociationMixin,
    HasOne,
} from 'sequelize';
import { Role, PermissionRole, Action } from '@models';

export interface IPermissionProps {
    scope: string;
    primary: boolean;

    // Fields for hydratation only
    Action: Action;
    Role: Role[];
}

export class Permission extends Model {
    public id!: number;
    public scope!: string;
    public primary!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Fields for hydratation only
    public Action!: Action;
    public Role!: Role[];

    public getRoles!: HasManyGetAssociationsMixin<Role>;
    public addRole!: HasManyAddAssociationMixin<Role, PermissionRole>;
    public removeRole!: HasManyRemoveAssociationMixin<Role, PermissionRole>;
    public getActions!: HasOneGetAssociationMixin<Action>;
    public setAction!: HasOneSetAssociationMixin<Action, string>;

    public setActionByName(actionName: string) {
        Action.findOne({
            where: { action: actionName },
        }).then(actionResult => {
            if (actionResult) {
                this.setAction(actionResult);
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
