import bcrypt from "bcrypt";

// Temporary model imports until we convert models to TypeScript
const { Admin, Service, Staff, BusinessSettings } = require("../models");

export const initializeDefaultData = async (): Promise<void> => {
  try {
    // Check if default admin exists
    const adminCount = await Admin.count();

    if (adminCount === 0) {
      console.log("Creating default admin...");

      // Create default admin
      const hashedPassword = await bcrypt.hash("Admin123!", 10);
      await Admin.create({
        email: "admin@beaubook.com",
        password: hashedPassword,
        name: "System Administrator",
        role: "super_admin",
        isActive: true,
      });

      console.log("✅ Default admin created");
      console.log("   Email: admin@beaubook.com");
      console.log("   Password: Admin123!");
    }

    // Check if services exist
    const serviceCount = await Service.count();

    if (serviceCount === 0) {
      console.log("Creating default services...");

      const defaultServices = [
        {
          name: "Classic Haircut",
          description: "Professional haircut with wash and style",
          category: "Hair",
          duration: 45,
          price: 45,
          isActive: true,
        },
        {
          name: "Hair Color",
          description: "Full hair coloring service with professional products",
          category: "Hair",
          duration: 120,
          price: 120,
          isActive: true,
        },
        {
          name: "Manicure",
          description: "Classic manicure with polish",
          category: "Nails",
          duration: 30,
          price: 35,
          isActive: true,
        },
        {
          name: "Pedicure",
          description: "Relaxing pedicure with massage",
          category: "Nails",
          duration: 45,
          price: 45,
          isActive: true,
        },
        {
          name: "Facial Treatment",
          description: "Deep cleansing facial with moisturizing",
          category: "Spa",
          duration: 60,
          price: 80,
          isActive: true,
        },
        {
          name: "Massage Therapy",
          description: "Relaxing full body massage",
          category: "Spa",
          duration: 60,
          price: 90,
          isActive: true,
        },
      ];

      await Service.bulkCreate(defaultServices);
      console.log("✅ Default services created");
    }

    // Check if staff exist
    const staffCount = await Staff.count();

    if (staffCount === 0) {
      console.log("Creating default staff members...");

      const defaultStaff = [
        {
          name: "Sarah Johnson",
          email: "sarah@beaubook.com",
          phone: "555-0101",
          bio: "Senior stylist with 10+ years experience",
          specialties: ["Hair Color", "Classic Haircut", "Hair Styling"],
          isActive: true,
        },
        {
          name: "Emily Chen",
          email: "emily@beaubook.com",
          phone: "555-0102",
          bio: "Nail art specialist and manicure expert",
          specialties: ["Manicure", "Pedicure", "Nail Art"],
          isActive: true,
        },
        {
          name: "Michael Rodriguez",
          email: "michael@beaubook.com",
          phone: "555-0103",
          bio: "Expert in men's grooming and classic cuts",
          specialties: ["Classic Haircut", "Beard Trim", "Hair Styling"],
          isActive: true,
        },
        {
          name: "Jessica Park",
          email: "jessica@beaubook.com",
          phone: "555-0104",
          bio: "Certified massage therapist and spa specialist",
          specialties: [
            "Massage Therapy",
            "Facial Treatment",
            "Spa Treatments",
          ],
          isActive: true,
        },
        {
          name: "David Kim",
          email: "david@beaubook.com",
          phone: "555-0105",
          bio: "Creative hair colorist and stylist",
          specialties: ["Hair Color", "Classic Haircut", "Hair Treatment"],
          isActive: true,
        },
      ];

      const createdStaff = await Staff.bulkCreate(defaultStaff);

      // Create default schedules for staff (Monday to Friday, 9 AM to 6 PM)
      const schedules = [];
      for (const staff of createdStaff) {
        for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
          schedules.push({
            staffId: staff.id,
            dayOfWeek,
            startTime: "09:00",
            endTime: "18:00",
            isAvailable: true,
          });
        }
        // Saturday schedule (10 AM to 4 PM)
        schedules.push({
          staffId: staff.id,
          dayOfWeek: 6,
          startTime: "10:00",
          endTime: "16:00",
          isAvailable: true,
        });
      }

      // Import StaffSchedule model if it exists
      try {
        const { StaffSchedule } = require("../models");
        await StaffSchedule.bulkCreate(schedules);
        console.log("✅ Default staff schedules created");
      } catch (error) {
        console.log("⚠️ StaffSchedule model not found, skipping schedules");
      }

      console.log("✅ Default staff members created");
    }

    // Check if business settings exist
    const settingsCount = await BusinessSettings.count();

    if (settingsCount === 0) {
      console.log("Creating default business settings...");

      await BusinessSettings.create({
        businessName: "BeauBook Salon",
        email: "info@beaubook.com",
        phone: "(555) 123-4567",
        address: "123 Beauty Lane, Vancouver, BC V6B 1A1",
        website: "https://beaubook.com",
        timezone: "America/Vancouver",
        currency: "CAD",
        bookingLeadTime: 2, // 2 hours
        maxAdvanceBooking: 60, // 60 days
        cancellationPolicy:
          "Cancellations must be made at least 24 hours in advance.",
        socialMedia: {
          facebook: "https://facebook.com/beaubook",
          instagram: "https://instagram.com/beaubook",
          twitter: "https://twitter.com/beaubook",
        },
        businessHours: {
          monday: { open: "09:00", close: "18:00" },
          tuesday: { open: "09:00", close: "18:00" },
          wednesday: { open: "09:00", close: "18:00" },
          thursday: { open: "09:00", close: "18:00" },
          friday: { open: "09:00", close: "18:00" },
          saturday: { open: "10:00", close: "16:00" },
          sunday: { open: null, close: null },
        },
      });

      console.log("✅ Default business settings created");
    }

    console.log("✅ Database initialization complete");
  } catch (error) {
    console.error("❌ Error initializing default data:", error);
    throw error;
  }
};
