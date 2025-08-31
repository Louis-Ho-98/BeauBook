module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
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
    },
    {
      tableName: "admins",
      timestamps: true,
      underscored: true,
    }
  );

  return Admin;
};
