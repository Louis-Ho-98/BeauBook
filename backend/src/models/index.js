const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// Import all models
const Admin = require("./admin.model")(sequelize, DataTypes);
const Staff = require("./staff.model")(sequelize, DataTypes);
const Service = require("./service.model")(sequelize, DataTypes);
const Booking = require("./booking.model")(sequelize, DataTypes);
const StaffSchedule = require("./staffSchedule.model")(sequelize, DataTypes);
const StaffBreak = require("./staffBreak.model")(sequelize, DataTypes);
const BusinessSettings = require("./businessSettings.model")(
  sequelize,
  DataTypes
);

// Define associations
// Staff associations
Staff.hasMany(Booking, { foreignKey: "staff_id", as: "bookings" });
Staff.hasMany(StaffSchedule, { foreignKey: "staff_id", as: "schedules" });
Staff.hasMany(StaffBreak, { foreignKey: "staff_id", as: "breaks" });

// Service associations
Service.hasMany(Booking, { foreignKey: "service_id", as: "bookings" });

// Booking associations
Booking.belongsTo(Staff, { foreignKey: "staff_id", as: "staff" });
Booking.belongsTo(Service, { foreignKey: "service_id", as: "service" });

// StaffSchedule associations
StaffSchedule.belongsTo(Staff, { foreignKey: "staff_id", as: "staff" });

// StaffBreak associations
StaffBreak.belongsTo(Staff, { foreignKey: "staff_id", as: "staff" });

// Export models and sequelize instance
module.exports = {
  sequelize,
  Admin,
  Staff,
  Service,
  Booking,
  StaffSchedule,
  StaffBreak,
  BusinessSettings,
};
