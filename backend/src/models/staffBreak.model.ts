import { Sequelize, DataTypes, Model, Optional } from "sequelize";

export interface StaffBreakAttributes {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface StaffBreakCreationAttributes
  extends Optional<StaffBreakAttributes, "id"> {}

export class StaffBreak
  extends Model<StaffBreakAttributes, StaffBreakCreationAttributes>
  implements StaffBreakAttributes
{
  public id!: string;
  public staff_id!: string;
  public day_of_week!: number;
  public start_time!: string;
  public end_time!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initStaffBreakModel(
  sequelize: Sequelize
): typeof StaffBreak {
  StaffBreak.init(
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
    },
    {
      sequelize,
      tableName: "staff_breaks",
      timestamps: true,
      underscored: true,
    }
  );

  return StaffBreak;
}
