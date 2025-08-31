import { Sequelize, DataTypes, Model, Optional } from "sequelize";

export interface StaffAttributes {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialties?: string[];
  avatar_url?: string;
  is_active?: boolean;
}

export interface StaffCreationAttributes
  extends Optional<
    StaffAttributes,
    "id" | "phone" | "specialties" | "avatar_url" | "is_active"
  > {}

export class Staff
  extends Model<StaffAttributes, StaffCreationAttributes>
  implements StaffAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public phone?: string;
  public specialties?: string[];
  public avatar_url?: string;
  public is_active?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initStaffModel(sequelize: Sequelize): typeof Staff {
  Staff.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
      },
      specialties: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      avatar_url: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "staff",
      timestamps: true,
      underscored: true,
    }
  );

  return Staff;
}
