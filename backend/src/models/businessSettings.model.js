module.exports = (sequelize, DataTypes) => {
  const BusinessSettings = sequelize.define(
    "BusinessSettings",
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
      tableName: "business_settings",
      timestamps: true,
      underscored: true,
    }
  );

  return BusinessSettings;
};
