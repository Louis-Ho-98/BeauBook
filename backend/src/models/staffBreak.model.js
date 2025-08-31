module.exports = (sequelize, DataTypes) => {
  const StaffBreak = sequelize.define(
    "StaffBreak",
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
      tableName: "staff_breaks",
      timestamps: true,
      underscored: true,
    }
  );

  return StaffBreak;
};
