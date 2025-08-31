import { Sequelize, DataTypes, Model, Optional } from "sequelize";

export interface BusinessSettingsAttributes {
  id: string;
  business_name: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  opening_time?: string;
  closing_time?: string;
  booking_buffer_minutes?: number;
  max_advance_booking_days?: number;
  timezone?: string;
}

export interface BusinessSettingsCreationAttributes
  extends Optional<
    BusinessSettingsAttributes,
    | "id"
    | "business_address"
    | "business_phone"
    | "business_email"
    | "opening_time"
    | "closing_time"
    | "booking_buffer_minutes"
    | "max_advance_booking_days"
    | "timezone"
  > {}

export class BusinessSettings
  extends Model<BusinessSettingsAttributes, BusinessSettingsCreationAttributes>
  implements BusinessSettingsAttributes
{
  public id!: string;
  public business_name!: string;
  public business_address?: string;
  public business_phone?: string;
  public business_email?: string;
  public opening_time?: string;
  public closing_time?: string;
  public booking_buffer_minutes?: number;
  public max_advance_booking_days?: number;
  public timezone?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initBusinessSettingsModel(
  sequelize: Sequelize
): typeof BusinessSettings {
  BusinessSettings.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      business_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      business_address: {
        type: DataTypes.TEXT,
      },
      business_phone: {
        type: DataTypes.STRING,
      },
      business_email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      opening_time: {
        type: DataTypes.TIME,
        defaultValue: "09:00",
      },
      closing_time: {
        type: DataTypes.TIME,
        defaultValue: "18:00",
      },
      booking_buffer_minutes: {
        type: DataTypes.INTEGER,
        defaultValue: 15,
      },
      max_advance_booking_days: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
      },
      timezone: {
        type: DataTypes.STRING,
        defaultValue: "America/Vancouver",
      },
    },
    {
      sequelize,
      tableName: "business_settings",
      timestamps: true,
      underscored: true,
    }
  );

  return BusinessSettings;
}
