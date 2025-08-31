import { Sequelize, DataTypes, Model, Optional } from "sequelize";

export type BookingStatus = "confirmed" | "cancelled" | "completed" | "no-show";

export interface BookingAttributes {
  id: string;
  booking_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  staff_id: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  notes?: string;
}

export interface BookingCreationAttributes
  extends Optional<
    BookingAttributes,
    "id" | "booking_ref" | "status" | "notes"
  > {}

export class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  public id!: string;
  public booking_ref!: string;
  public customer_name!: string;
  public customer_email!: string;
  public customer_phone!: string;
  public staff_id!: string;
  public service_id!: string;
  public booking_date!: string;
  public start_time!: string;
  public end_time!: string;
  public status!: BookingStatus;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initBookingModel(sequelize: Sequelize): typeof Booking {
  Booking.init(
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
      sequelize,
      tableName: "bookings",
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ["booking_date", "staff_id"] },
        { fields: ["customer_email"] },
        { fields: ["status", "booking_date"] },
      ],
    }
  );

  Booking.beforeCreate((booking: Booking) => {
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    booking.booking_ref = `BK-${date}-${random}`;
  });

  return Booking;
}
