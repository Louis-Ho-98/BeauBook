// App State
const appState = {
  currentView: "booking",
  selectedService: null,
  selectedStaff: null,
  selectedDate: null,
  selectedTime: null,
  customerInfo: {},
  bookings: [],
  staff: [],
  services: [],
  isAdminLoggedIn: false,
  adminTab: "overview",
};

// Mock Data
const mockServices = [
  {
    id: 1,
    name: "Haircut & Style",
    duration: 45,
    price: 45,
    category: "Hair",
    icon: "✂️",
    description: "Professional haircut and styling",
  },
  {
    id: 2,
    name: "Hair Color",
    duration: 120,
    price: 95,
    category: "Hair",
    icon: "🎨",
    description: "Full hair coloring service",
  },
  {
    id: 3,
    name: "Highlights",
    duration: 90,
    price: 120,
    category: "Hair",
    icon: "✨",
    description: "Professional highlights",
  },
  {
    id: 4,
    name: "Manicure",
    duration: 30,
    price: 35,
    category: "Nails",
    icon: "💅",
    description: "Classic manicure treatment",
  },
  {
    id: 5,
    name: "Pedicure",
    duration: 45,
    price: 45,
    category: "Nails",
    icon: "🦶",
    description: "Relaxing pedicure treatment",
  },
  {
    id: 6,
    name: "Gel Nails",
    duration: 60,
    price: 55,
    category: "Nails",
    icon: "💎",
    description: "Long-lasting gel nail application",
  },
  {
    id: 7,
    name: "Facial",
    duration: 60,
    price: 75,
    category: "Skin",
    icon: "🧖‍♀️",
    description: "Rejuvenating facial treatment",
  },
  {
    id: 8,
    name: "Chemical Peel",
    duration: 45,
    price: 95,
    category: "Skin",
    icon: "🧪",
    description: "Professional chemical peel",
  },
  {
    id: 9,
    name: "Massage",
    duration: 60,
    price: 85,
    category: "Body",
    icon: "💆‍♀️",
    description: "Full body relaxation massage",
  },
  {
    id: 10,
    name: "Hot Stone Massage",
    duration: 90,
    price: 120,
    category: "Body",
    icon: "🔥",
    description: "Therapeutic hot stone massage",
  },
];

const mockStaff = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@beaubook.com",
    phone: "(555) 234-5678",
    role: "Senior Stylist",
    specialties: [1, 2, 3],
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Emily Chen",
    email: "emily@beaubook.com",
    phone: "(555) 345-6789",
    role: "Nail Specialist",
    specialties: [4, 5, 6],
    avatar: "EC",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@beaubook.com",
    phone: "(555) 456-7890",
    role: "Massage Therapist",
    specialties: [9, 10],
    avatar: "MB",
  },
  {
    id: 4,
    name: "Lisa Wang",
    email: "lisa@beaubook.com",
    phone: "(555) 567-8901",
    role: "Esthetician",
    specialties: [7, 8],
    avatar: "LW",
  },
  {
    id: 5,
    name: "Any Available",
    email: "",
    phone: "",
    role: "First Available",
    specialties: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    avatar: "?",
  },
];

const mockSchedules = {
  1: {
    monday: {
      start: "09:00",
      end: "18:00",
      breaks: [{ start: "12:00", end: "13:00" }],
    },
    tuesday: {
      start: "09:00",
      end: "18:00",
      breaks: [{ start: "12:00", end: "13:00" }],
    },
    wednesday: {
      start: "09:00",
      end: "18:00",
      breaks: [{ start: "12:00", end: "13:00" }],
    },
    thursday: {
      start: "09:00",
      end: "18:00",
      breaks: [{ start: "12:00", end: "13:00" }],
    },
    friday: {
      start: "09:00",
      end: "18:00",
      breaks: [{ start: "12:00", end: "13:00" }],
    },
    saturday: { start: "10:00", end: "16:00", breaks: [] },
    sunday: null,
  },
  2: {
    monday: {
      start: "10:00",
      end: "19:00",
      breaks: [{ start: "13:00", end: "14:00" }],
    },
    tuesday: {
      start: "10:00",
      end: "19:00",
      breaks: [{ start: "13:00", end: "14:00" }],
    },
    wednesday: {
      start: "10:00",
      end: "19:00",
      breaks: [{ start: "13:00", end: "14:00" }],
    },
    thursday: {
      start: "10:00",
      end: "19:00",
      breaks: [{ start: "13:00", end: "14:00" }],
    },
    friday: {
      start: "10:00",
      end: "19:00",
      breaks: [{ start: "13:00", end: "14:00" }],
    },
    saturday: { start: "10:00", end: "16:00", breaks: [] },
    sunday: null,
  },
  3: {
    monday: {
      start: "11:00",
      end: "20:00",
      breaks: [{ start: "14:00", end: "15:00" }],
    },
    tuesday: {
      start: "11:00",
      end: "20:00",
      breaks: [{ start: "14:00", end: "15:00" }],
    },
    wednesday: {
      start: "11:00",
      end: "20:00",
      breaks: [{ start: "14:00", end: "15:00" }],
    },
    thursday: {
      start: "11:00",
      end: "20:00",
      breaks: [{ start: "14:00", end: "15:00" }],
    },
    friday: {
      start: "11:00",
      end: "20:00",
      breaks: [{ start: "14:00", end: "15:00" }],
    },
    saturday: { start: "11:00", end: "17:00", breaks: [] },
    sunday: null,
  },
  4: {
    monday: {
      start: "09:00",
      end: "17:00",
      breaks: [{ start: "12:30", end: "13:30" }],
    },
    tuesday: {
      start: "09:00",
      end: "17:00",
      breaks: [{ start: "12:30", end: "13:30" }],
    },
    wednesday: {
      start: "09:00",
      end: "17:00",
      breaks: [{ start: "12:30", end: "13:30" }],
    },
    thursday: {
      start: "09:00",
      end: "17:00",
      breaks: [{ start: "12:30", end: "13:30" }],
    },
    friday: {
      start: "09:00",
      end: "17:00",
      breaks: [{ start: "12:30", end: "13:30" }],
    },
    saturday: null,
    sunday: null,
  },
  5: {}, // Any available - will aggregate from others
};

const mockBookings = [
  {
    id: "BK-2024-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "(555) 111-2222",
    serviceId: 1,
    staffId: 1,
    date: new Date().toISOString().split("T")[0],
    time: "14:00",
    status: "confirmed",
    notes: "",
  },
  {
    id: "BK-2024-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "(555) 333-4444",
    serviceId: 4,
    staffId: 2,
    date: new Date().toISOString().split("T")[0],
    time: "15:30",
    status: "confirmed",
    notes: "First time customer",
  },
];

// Initialize app state
appState.services = mockServices;
appState.staff = mockStaff;
appState.bookings = mockBookings;

// View Management
function showView(viewName) {
  // Hide all views
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.remove("active");
  });

  // Show selected view
  document.getElementById(`${viewName}-view`).classList.add("active");

  // Update nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  if (viewName === "booking") {
    document
      .querySelector('.nav-link[onclick*="booking"]')
      .classList.add("active");
    resetBookingFlow();
  } else if (viewName === "admin-login" || viewName === "admin-dashboard") {
    document
      .querySelector('.nav-link[onclick*="admin"]')
      .classList.add("active");
  }

  appState.currentView = viewName;
}

// Booking Flow
function resetBookingFlow() {
  appState.selectedService = null;
  appState.selectedStaff = null;
  appState.selectedDate = null;
  appState.selectedTime = null;
  appState.customerInfo = {};

  // Reset steps
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.remove("active", "completed");
  });
  document.getElementById("step-service").classList.add("active");

  // Render services
  renderServices();
}

function renderServices() {
  const container = document.getElementById("service-list");
  container.innerHTML = "";

  appState.services.forEach((service) => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.onclick = () => selectService(service);

    card.innerHTML = `
            <div class="service-icon">${service.icon}</div>
            <div class="service-name">${service.name}</div>
            <div class="service-duration">${service.duration} minutes</div>
            <div class="service-price">$${service.price}</div>
        `;

    container.appendChild(card);
  });
}

function selectService(service) {
  appState.selectedService = service;

  // Update UI
  document.querySelectorAll(".service-card").forEach((card) => {
    card.classList.remove("selected");
  });
  event.currentTarget.classList.add("selected");

  // Mark step as completed and activate next
  document.getElementById("step-service").classList.add("completed");
  document.getElementById("step-staff").classList.add("active");

  // Render staff who can perform this service
  renderStaff(service.id);
}

function renderStaff(serviceId) {
  const container = document.getElementById("staff-list");
  container.innerHTML = "";

  const availableStaff = appState.staff.filter((staff) =>
    staff.specialties.includes(serviceId)
  );

  availableStaff.forEach((staff) => {
    const card = document.createElement("div");
    card.className = "staff-card";
    card.onclick = () => selectStaff(staff);

    card.innerHTML = `
            <div class="staff-avatar">${staff.avatar}</div>
            <div class="staff-name">${staff.name}</div>
            <div class="staff-role">${staff.role}</div>
        `;

    container.appendChild(card);
  });
}

function selectStaff(staff) {
  appState.selectedStaff = staff;

  // Update UI
  document.querySelectorAll(".staff-card").forEach((card) => {
    card.classList.remove("selected");
  });
  event.currentTarget.classList.add("selected");

  // Mark step as completed and activate next
  document.getElementById("step-staff").classList.add("completed");
  document.getElementById("step-datetime").classList.add("active");

  // Set up date picker
  const datePicker = document.getElementById("date-picker");
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  datePicker.min = today.toISOString().split("T")[0];
  datePicker.max = maxDate.toISOString().split("T")[0];
  datePicker.value = "";
}

function updateTimeSlots() {
  const selectedDate = document.getElementById("date-picker").value;
  if (!selectedDate) return;

  appState.selectedDate = selectedDate;

  const container = document.getElementById("timeslots");
  container.innerHTML = "";

  // Generate time slots (mock - in real app, would check availability)
  const slots = generateTimeSlots(
    appState.selectedStaff.id,
    selectedDate,
    appState.selectedService.duration
  );

  slots.forEach((slot) => {
    const button = document.createElement("button");
    button.className = "timeslot";
    button.textContent = slot.time;
    button.disabled = !slot.available;
    button.onclick = () => selectTime(slot.time);

    container.appendChild(button);
  });
}

function generateTimeSlots(staffId, date, duration) {
  const slots = [];
  const dayOfWeek = new Date(date).getDay();
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayName = dayNames[dayOfWeek];

  // Get staff schedule
  const schedule = mockSchedules[staffId] || mockSchedules[1];
  const daySchedule = schedule[dayName];

  if (!daySchedule) {
    return slots; // Staff doesn't work this day
  }

  // Generate slots from start to end time
  const startHour = parseInt(daySchedule.start.split(":")[0]);
  const endHour = parseInt(daySchedule.end.split(":")[0]);

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      // Check if slot has enough time before end of day
      const slotEndMinutes = hour * 60 + minute + duration;
      const dayEndMinutes = endHour * 60;

      if (slotEndMinutes <= dayEndMinutes) {
        // Check if slot conflicts with breaks
        let isInBreak = false;
        daySchedule.breaks.forEach((breakTime) => {
          const breakStart =
            parseInt(breakTime.start.split(":")[0]) * 60 +
            parseInt(breakTime.start.split(":")[1]);
          const breakEnd =
            parseInt(breakTime.end.split(":")[0]) * 60 +
            parseInt(breakTime.end.split(":")[1]);
          const slotStart = hour * 60 + minute;

          if (
            (slotStart >= breakStart && slotStart < breakEnd) ||
            (slotEndMinutes > breakStart && slotEndMinutes <= breakEnd)
          ) {
            isInBreak = true;
          }
        });

        // Check if slot conflicts with existing bookings
        const hasBooking = appState.bookings.some(
          (booking) =>
            booking.staffId === staffId &&
            booking.date === date &&
            booking.time === time &&
            booking.status !== "cancelled"
        );

        if (!isInBreak && !hasBooking) {
          slots.push({ time, available: true });
        } else if (hasBooking) {
          slots.push({ time, available: false });
        }
      }
    }
  }

  return slots;
}

function selectTime(time) {
  appState.selectedTime = time;

  // Update UI
  document.querySelectorAll(".timeslot").forEach((slot) => {
    slot.classList.remove("selected");
  });
  event.currentTarget.classList.add("selected");

  // Mark step as completed and activate next
  document.getElementById("step-datetime").classList.add("completed");
  document.getElementById("step-contact").classList.add("active");

  // Update booking summary
  updateBookingSummary();
}

function updateBookingSummary() {
  const summary = document.getElementById("booking-summary-content");
  const service = appState.selectedService;
  const staff = appState.selectedStaff;
  const date = new Date(appState.selectedDate);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  summary.innerHTML = `
        <div class="summary-item">
            <span>Service:</span>
            <span>${service.name}</span>
        </div>
        <div class="summary-item">
            <span>Professional:</span>
            <span>${staff.name}</span>
        </div>
        <div class="summary-item">
            <span>Date:</span>
            <span>${dateStr}</span>
        </div>
        <div class="summary-item">
            <span>Time:</span>
            <span>${appState.selectedTime}</span>
        </div>
        <div class="summary-item">
            <span>Duration:</span>
            <span>${service.duration} minutes</span>
        </div>
        <div class="summary-item">
            <span>Total:</span>
            <span>$${service.price}</span>
        </div>
    `;
}

// Admin Functions
function showAdminTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected tab
  document.getElementById(`admin-${tabName}`).classList.add("active");

  // Update sidebar links
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.remove("active");
  });
  document
    .querySelector(`.sidebar-link[onclick*="${tabName}"]`)
    .classList.add("active");

  appState.adminTab = tabName;

  // Load tab-specific data
  switch (tabName) {
    case "bookings":
      renderBookingsTable();
      break;
    case "staff":
      renderStaffAdmin();
      break;
    case "services":
      renderServicesTable();
      break;
    case "schedules":
      renderScheduleManager();
      break;
  }
}

function renderBookingsTable() {
  const tbody = document.getElementById("bookings-table-body");
  tbody.innerHTML = "";

  appState.bookings.forEach((booking) => {
    const service = appState.services.find((s) => s.id === booking.serviceId);
    const staff = appState.staff.find((s) => s.id === booking.staffId);

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.customerName}</td>
            <td>${booking.customerEmail}</td>
            <td>${service ? service.name : "Unknown"}</td>
            <td>${staff ? staff.name : "Unknown"}</td>
            <td>${booking.date} ${booking.time}</td>
            <td><span class="badge badge-${booking.status}">${
      booking.status
    }</span></td>
            <td>
                <button class="btn btn-sm" onclick="updateBookingStatus('${
                  booking.id
                }')">Update</button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function renderStaffAdmin() {
  const container = document.getElementById("staff-list-admin");
  container.innerHTML = "";

  appState.staff
    .filter((s) => s.id !== 5)
    .forEach((staff) => {
      // Exclude "Any Available"
      const card = document.createElement("div");
      card.className = "staff-card-admin";

      card.innerHTML = `
            <div class="staff-card-header">
                <div class="staff-avatar">${staff.avatar}</div>
                <div class="staff-info">
                    <h4>${staff.name}</h4>
                    <p>${staff.role}</p>
                    <p>${staff.email}</p>
                    <p>${staff.phone}</p>
                </div>
            </div>
            <div class="staff-actions">
                <button onclick="editStaff(${staff.id})">Edit</button>
                <button onclick="editStaffSchedule(${staff.id})">Schedule</button>
                <button onclick="deleteStaff(${staff.id})">Delete</button>
            </div>
        `;

      container.appendChild(card);
    });
}

function renderServicesTable() {
  const tbody = document.getElementById("services-table-body");
  tbody.innerHTML = "";

  appState.services.forEach((service) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${service.name}</td>
            <td>${service.category}</td>
            <td>${service.duration} min</td>
            <td>$${service.price}</td>
            <td><span class="badge badge-confirmed">Active</span></td>
            <td>
                <button class="btn btn-sm" onclick="editService(${service.id})">Edit</button>
                <button class="btn btn-sm" onclick="deleteService(${service.id})">Delete</button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function renderScheduleManager() {
  const select = document.getElementById("schedule-staff-select");
  select.innerHTML = "<option>Select Staff Member</option>";

  appState.staff
    .filter((s) => s.id !== 5)
    .forEach((staff) => {
      const option = document.createElement("option");
      option.value = staff.id;
      option.textContent = staff.name;
      select.appendChild(option);
    });
}

function loadStaffSchedule() {
  const staffId = parseInt(
    document.getElementById("schedule-staff-select").value
  );
  if (!staffId) return;

  const schedule = mockSchedules[staffId] || {};
  const container = document.getElementById("schedule-grid");
  container.innerHTML = "";

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayKeys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  days.forEach((day, index) => {
    const daySchedule = schedule[dayKeys[index]];
    const dayDiv = document.createElement("div");
    dayDiv.className = "schedule-day";

    dayDiv.innerHTML = `
            <label>${day}</label>
            <div class="schedule-times">
                <input type="time" value="${
                  daySchedule ? daySchedule.start : "09:00"
                }" ${!daySchedule ? "disabled" : ""}>
                <span>to</span>
                <input type="time" value="${
                  daySchedule ? daySchedule.end : "18:00"
                }" ${!daySchedule ? "disabled" : ""}>
            </div>
            <div class="schedule-toggle">
                <input type="checkbox" id="day-${index}" ${
      daySchedule ? "checked" : ""
    } onchange="toggleDay(${index})">
                <label for="day-${index}">Working</label>
            </div>
        `;

    container.appendChild(dayDiv);
  });
}

// Modal Functions
function openStaffModal() {
  document.getElementById("modal-overlay").classList.add("active");
  document.getElementById("staff-modal").classList.add("active");

  // Populate specialties
  const container = document.getElementById("staff-specialties");
  container.innerHTML = "";

  appState.services.forEach((service) => {
    const item = document.createElement("div");
    item.className = "checkbox-item";
    item.innerHTML = `
            <input type="checkbox" id="specialty-${service.id}" value="${service.id}">
            <label for="specialty-${service.id}">${service.name}</label>
        `;
    container.appendChild(item);
  });
}

function openServiceModal() {
  document.getElementById("modal-overlay").classList.add("active");
  document.getElementById("service-modal").classList.add("active");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("active");
  });
}

// Form Handlers
document
  .getElementById("booking-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Collect customer info
    appState.customerInfo = {
      name: document.getElementById("customer-name").value,
      email: document.getElementById("customer-email").value,
      phone: document.getElementById("customer-phone").value,
      notes: document.getElementById("customer-notes").value,
    };

    // Create booking
    const bookingId = `BK-${Date.now()}`;
    const booking = {
      id: bookingId,
      customerName: appState.customerInfo.name,
      customerEmail: appState.customerInfo.email,
      customerPhone: appState.customerInfo.phone,
      serviceId: appState.selectedService.id,
      staffId: appState.selectedStaff.id,
      date: appState.selectedDate,
      time: appState.selectedTime,
      status: "confirmed",
      notes: appState.customerInfo.notes,
    };

    // Add to bookings
    appState.bookings.push(booking);

    // Show confirmation
    showConfirmation(booking);
  });

function showConfirmation(booking) {
  const service = appState.services.find((s) => s.id === booking.serviceId);
  const staff = appState.staff.find((s) => s.id === booking.staffId);
  const date = new Date(booking.date);
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const details = document.getElementById("confirmation-details");
  details.innerHTML = `
        <div class="confirmation-detail">
            <label>Booking Reference:</label>
            <span>${booking.id}</span>
        </div>
        <div class="confirmation-detail">
            <label>Service:</label>
            <span>${service.name}</span>
        </div>
        <div class="confirmation-detail">
            <label>Professional:</label>
            <span>${staff.name}</span>
        </div>
        <div class="confirmation-detail">
            <label>Date:</label>
            <span>${dateStr}</span>
        </div>
        <div class="confirmation-detail">
            <label>Time:</label>
            <span>${booking.time}</span>
        </div>
        <div class="confirmation-detail">
            <label>Duration:</label>
            <span>${service.duration} minutes</span>
        </div>
        <div class="confirmation-detail">
            <label>Price:</label>
            <span>$${service.price}</span>
        </div>
        <div class="confirmation-detail">
            <label>Email:</label>
            <span>${booking.customerEmail}</span>
        </div>
    `;

  showView("confirmation");
}

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;

  // Mock authentication
  if (email === "admin@beaubook.com" && password === "admin123") {
    appState.isAdminLoggedIn = true;
    showView("admin-dashboard");
  } else {
    alert("Invalid credentials. Please use the demo credentials provided.");
  }
});

document.getElementById("staff-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const newStaff = {
    id: Date.now(),
    name: document.getElementById("staff-name").value,
    email: document.getElementById("staff-email").value,
    phone: document.getElementById("staff-phone").value,
    role: "Staff Member",
    specialties: Array.from(
      document.querySelectorAll("#staff-specialties input:checked")
    ).map((cb) => parseInt(cb.value)),
    avatar: document
      .getElementById("staff-name")
      .value.split(" ")
      .map((n) => n[0])
      .join(""),
  };

  appState.staff.push(newStaff);
  closeModal();
  renderStaffAdmin();
  alert("Staff member added successfully!");
});

document
  .getElementById("service-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const newService = {
      id: Date.now(),
      name: document.getElementById("service-name").value,
      category: document.getElementById("service-category").value,
      duration: parseInt(document.getElementById("service-duration").value),
      price: parseFloat(document.getElementById("service-price").value),
      description: document.getElementById("service-description").value,
      icon: "✨",
    };

    appState.services.push(newService);
    closeModal();
    renderServicesTable();
    alert("Service added successfully!");
  });

// Helper Functions
function logout() {
  appState.isAdminLoggedIn = false;
  showView("admin-login");
}

function editStaff(staffId) {
  alert(`Edit staff ${staffId} - Feature coming soon!`);
}

function editStaffSchedule(staffId) {
  showAdminTab("schedules");
  document.getElementById("schedule-staff-select").value = staffId;
  loadStaffSchedule();
}

function deleteStaff(staffId) {
  if (confirm("Are you sure you want to delete this staff member?")) {
    appState.staff = appState.staff.filter((s) => s.id !== staffId);
    renderStaffAdmin();
    alert("Staff member deleted successfully!");
  }
}

function editService(serviceId) {
  alert(`Edit service ${serviceId} - Feature coming soon!`);
}

function deleteService(serviceId) {
  if (confirm("Are you sure you want to delete this service?")) {
    appState.services = appState.services.filter((s) => s.id !== serviceId);
    renderServicesTable();
    alert("Service deleted successfully!");
  }
}

function updateBookingStatus(bookingId) {
  const booking = appState.bookings.find((b) => b.id === bookingId);
  if (booking) {
    const newStatus = prompt(
      "Enter new status (confirmed/cancelled/completed):",
      booking.status
    );
    if (
      newStatus &&
      ["confirmed", "cancelled", "completed"].includes(newStatus)
    ) {
      booking.status = newStatus;
      renderBookingsTable();
      alert("Booking status updated successfully!");
    }
  }
}

function toggleDay(dayIndex) {
  // Toggle working day on/off
  const checkbox = document.getElementById(`day-${dayIndex}`);
  const timeInputs = checkbox
    .closest(".schedule-day")
    .querySelectorAll('input[type="time"]');

  timeInputs.forEach((input) => {
    input.disabled = !checkbox.checked;
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  renderServices();
});
