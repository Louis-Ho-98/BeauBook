module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "Service",
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
      tableName: "services",
      timestamps: true,
      underscored: true,
    }
  );

  return Service;
};
