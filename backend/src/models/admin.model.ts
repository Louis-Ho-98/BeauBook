import { Sequelize, DataTypes, Model, Optional } from "sequelize";

export interface AdminAttributes {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  is_active: boolean;
  role?: string;
}

export interface AdminCreationAttributes
  extends Optional<AdminAttributes, "id" | "role"> {}

export class Admin
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  public id!: string;
  public email!: string;
  public password_hash!: string;
  public name!: string;
  public role!: string;
  public is_active!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initAdminModel(sequelize: Sequelize): typeof Admin {
  Admin.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "admin",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "admins",
      timestamps: true,
      underscored: true,
    }
  );
  return Admin;
}
