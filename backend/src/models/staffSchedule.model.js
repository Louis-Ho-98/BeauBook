module.exports = (sequelize, DataTypes) => {
  const StaffSchedule = sequelize.define(
    "StaffSchedule",
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
};
