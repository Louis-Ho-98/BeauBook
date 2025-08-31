import sequelize from "../config/database";
import { DataTypes } from "sequelize";
import initAdminModel, { Admin } from "./admin.model";
import initStaffModel, { Staff } from "./staff.model";
import initServiceModel, { Service } from "./service.model";
import initBookingModel, { Booking } from "./booking.model";
import initStaffScheduleModel, { StaffSchedule } from "./staffSchedule.model";
import initStaffBreakModel, { StaffBreak } from "./staffBreak.model";
import initBusinessSettingsModel, {
  BusinessSettings,
} from "./businessSettings.model";

// Initialize models
const AdminModel = initAdminModel(sequelize);
const StaffModel = initStaffModel(sequelize);
const ServiceModel = initServiceModel(sequelize);
const BookingModel = initBookingModel(sequelize);
const StaffScheduleModel = initStaffScheduleModel(sequelize);
const StaffBreakModel = initStaffBreakModel(sequelize);
const BusinessSettingsModel = initBusinessSettingsModel(sequelize);

// Define associations
StaffModel.hasMany(BookingModel, { foreignKey: "staff_id", as: "bookings" });
StaffModel.hasMany(StaffScheduleModel, {
  foreignKey: "staff_id",
  as: "schedules",
});
StaffModel.hasMany(StaffBreakModel, { foreignKey: "staff_id", as: "breaks" });
ServiceModel.hasMany(BookingModel, {
  foreignKey: "service_id",
  as: "bookings",
});
BookingModel.belongsTo(StaffModel, { foreignKey: "staff_id", as: "staff" });
BookingModel.belongsTo(ServiceModel, {
  foreignKey: "service_id",
  as: "service",
});
StaffScheduleModel.belongsTo(StaffModel, {
  foreignKey: "staff_id",
  as: "staff",
});
StaffBreakModel.belongsTo(StaffModel, { foreignKey: "staff_id", as: "staff" });

export {
  sequelize,
  AdminModel as Admin,
  StaffModel as Staff,
  ServiceModel as Service,
  BookingModel as Booking,
  StaffScheduleModel as StaffSchedule,
  StaffBreakModel as StaffBreak,
  BusinessSettingsModel as BusinessSettings,
};
