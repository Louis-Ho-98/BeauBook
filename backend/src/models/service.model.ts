import { Sequelize, DataTypes, Model, Optional } from "sequelize";

export interface ServiceAttributes {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category?: string;
  is_active?: boolean;
}

export interface ServiceCreationAttributes
  extends Optional<
    ServiceAttributes,
    "id" | "description" | "category" | "is_active"
  > {}

export class Service
  extends Model<ServiceAttributes, ServiceCreationAttributes>
  implements ServiceAttributes
{
  public id!: string;
  public name!: string;
  public description?: string;
  public duration_minutes!: number;
  public price!: number;
  public category?: string;
  public is_active?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initServiceModel(sequelize: Sequelize): typeof Service {
  Service.init(
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
      description: {
        type: DataTypes.TEXT,
      },
      duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 15,
          max: 480,
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      category: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "services",
      timestamps: true,
      underscored: true,
    }
  );

  return Service;
}
