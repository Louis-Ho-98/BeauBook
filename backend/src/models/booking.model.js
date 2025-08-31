module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      booking_ref: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      customer_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      staff_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "staff",
          key: "id",
        },
      },
      service_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "services",
          key: "id",
        },
      },
      booking_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("confirmed", "cancelled", "completed", "no-show"),
        defaultValue: "confirmed",
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "bookings",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["booking_date", "staff_id"],
        },
        {
          fields: ["customer_email"],
        },
        {
          fields: ["status", "booking_date"],
        },
      ],
    }
  );

  // Generate booking reference before creating
  Booking.beforeCreate((booking) => {
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    booking.booking_ref = `BK-${date}-${random}`;
  });

  return Booking;
};
