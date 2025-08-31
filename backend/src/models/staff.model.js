module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    "Staff",
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
      tableName: "staff",
      timestamps: true,
      underscored: true,
    }
  );

  return Staff;
};
