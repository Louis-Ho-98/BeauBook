const bcrypt = require("bcrypt");
const {
  Admin,
  Staff,
  Service,
  StaffSchedule,
  BusinessSettings,
} = require("../models");

async function initializeDefaultData() {
  try {
    // Create default admin if none exists
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await Admin.create({
        email: process.env.DEFAULT_ADMIN_EMAIL || "admin@beaubook.com",
        password_hash: hashedPassword,
        name: "Admin User",
        role: "super_admin",
      });

      console.log("✅ Default admin created");
    }

    // Create default business settings if none exist
    const settingsCount = await BusinessSettings.count();
    if (settingsCount === 0) {
      await BusinessSettings.create({
        business_name: process.env.BUSINESS_NAME || "BeauBook Salon",
        business_email: process.env.BUSINESS_EMAIL || "info@beaubook.com",
        business_phone: process.env.BUSINESS_PHONE || "(555) 123-4567",
        business_address:
          process.env.BUSINESS_ADDRESS || "123 Beauty Lane, Vancouver, BC",
        opening_time: "09:00",
        closing_time: "18:00",
        booking_buffer_minutes: 15,
        max_advance_booking_days: 30,
        timezone: "America/Vancouver",
      });

      console.log("✅ Default business settings created");
    }

    // Create sample services if none exist
    const serviceCount = await Service.count();
    if (serviceCount === 0) {
      const services = [
        {
          name: "Haircut & Style",
          duration_minutes: 45,
          price: 45,
          category: "Hair",
          description: "Professional haircut and styling",
        },
        {
          name: "Hair Color",
          duration_minutes: 120,
          price: 95,
          category: "Hair",
          description: "Full hair coloring service",
        },
        {
          name: "Highlights",
          duration_minutes: 90,
          price: 120,
          category: "Hair",
          description: "Professional highlights",
        },
        {
          name: "Manicure",
          duration_minutes: 30,
          price: 35,
          category: "Nails",
          description: "Classic manicure treatment",
        },
        {
          name: "Pedicure",
          duration_minutes: 45,
          price: 45,
          category: "Nails",
          description: "Relaxing pedicure treatment",
        },
        {
          name: "Gel Nails",
          duration_minutes: 60,
          price: 55,
          category: "Nails",
          description: "Long-lasting gel nail application",
        },
        {
          name: "Facial",
          duration_minutes: 60,
          price: 75,
          category: "Skin",
          description: "Rejuvenating facial treatment",
        },
        {
          name: "Chemical Peel",
          duration_minutes: 45,
          price: 95,
          category: "Skin",
          description: "Professional chemical peel",
        },
        {
          name: "Massage",
          duration_minutes: 60,
          price: 85,
          category: "Body",
          description: "Full body relaxation massage",
        },
        {
          name: "Hot Stone Massage",
          duration_minutes: 90,
          price: 120,
          category: "Body",
          description: "Therapeutic hot stone massage",
        },
      ];

      const createdServices = await Service.bulkCreate(services);
      console.log(`✅ ${createdServices.length} default services created`);
    }

    // Create sample staff if none exist
    const staffCount = await Staff.count();
    if (staffCount === 0) {
      // Get all service IDs
      const services = await Service.findAll();
      const hairServiceIds = services
        .filter((s) => s.category === "Hair")
        .map((s) => s.id);
      const nailServiceIds = services
        .filter((s) => s.category === "Nails")
        .map((s) => s.id);
      const skinServiceIds = services
        .filter((s) => s.category === "Skin")
        .map((s) => s.id);
      const bodyServiceIds = services
        .filter((s) => s.category === "Body")
        .map((s) => s.id);

      const staffMembers = [
        {
          name: "Sarah Johnson",
          email: "sarah@beaubook.com",
          phone: "(555) 234-5678",
          specialties: hairServiceIds,
        },
        {
          name: "Emily Chen",
          email: "emily@beaubook.com",
          phone: "(555) 345-6789",
          specialties: nailServiceIds,
        },
        {
          name: "Michael Brown",
          email: "michael@beaubook.com",
          phone: "(555) 456-7890",
          specialties: bodyServiceIds,
        },
        {
          name: "Lisa Wang",
          email: "lisa@beaubook.com",
          phone: "(555) 567-8901",
          specialties: skinServiceIds,
        },
      ];

      for (const staffData of staffMembers) {
        const staff = await Staff.create(staffData);

        // Create default schedule (Mon-Fri 9-6)
        const schedules = [];
        for (let day = 1; day <= 5; day++) {
          schedules.push({
            staff_id: staff.id,
            day_of_week: day,
            start_time: "09:00",
            end_time: "18:00",
            is_active: true,
          });
        }

        // Saturday schedule
        schedules.push({
          staff_id: staff.id,
          day_of_week: 6,
          start_time: "10:00",
          end_time: "16:00",
          is_active: true,
        });

        await StaffSchedule.bulkCreate(schedules);
      }

      console.log("✅ Default staff and schedules created");
    }

    console.log("✅ Database initialization complete");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}

module.exports = {
  initializeDefaultData,
};
