import { Model, DataTypes, Sequelize } from 'sequelize';

export class Contact extends Model {
    public id!: number;
    public name!: string;
    public phoneNumber!: string;
    public email!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initContact = (db: Sequelize) => {
    Contact.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: false,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: 'Contact',
            sequelize: db,
        }
    );
};
