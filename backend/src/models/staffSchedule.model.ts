import { Sequelize, DataTypes, Model, Optional } from "sequelize";

export interface StaffScheduleAttributes {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
}

export interface StaffScheduleCreationAttributes
  extends Optional<StaffScheduleAttributes, "id" | "is_active"> {}

export class StaffSchedule
  extends Model<StaffScheduleAttributes, StaffScheduleCreationAttributes>
  implements StaffScheduleAttributes
{
  public id!: string;
  public staff_id!: string;
  public day_of_week!: number;
  public start_time!: string;
  public end_time!: string;
  public is_active?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initStaffScheduleModel(
  sequelize: Sequelize
): typeof StaffSchedule {
  StaffSchedule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      staff_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "staff",
          key: "id",
        },
      },
      day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 6,
        },
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "staff_schedules",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["staff_id", "day_of_week"],
        },
      ],
    }
  );

  return StaffSchedule;
}
