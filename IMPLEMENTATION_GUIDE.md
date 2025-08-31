# BeauBook Implementation Guide

## Quick Start

This guide will walk you through building the BeauBook MVP from scratch. The system includes:

- Customer booking interface (no login required)
- Admin dashboard (login required)
- PostgreSQL database for data persistence
- Email confirmations for bookings
- Free deployment options

## Project Structure

```
BeauBook/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── email.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── booking.controller.js
│   │   │   ├── service.controller.js
│   │   │   ├── staff.controller.js
│   │   │   └── admin.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── admin.model.js
│   │   │   ├── booking.model.js
│   │   │   ├── service.model.js
│   │   │   ├── staff.model.js
│   │   │   └── schedule.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── booking.routes.js
│   │   │   ├── service.routes.js
│   │   │   ├── staff.routes.js
│   │   │   └── admin.routes.js
│   │   ├── services/
│   │   │   ├── availability.service.js
│   │   │   ├── booking.service.js
│   │   │   └── email.service.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── booking/
    │   │   │   ├── ServiceSelector.jsx
    │   │   │   ├── StaffSelector.jsx
    │   │   │   ├── DateTimePicker.jsx
    │   │   │   ├── BookingForm.jsx
    │   │   │   └── BookingConfirmation.jsx
    │   │   ├── admin/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── StaffManager.jsx
    │   │   │   ├── ServiceManager.jsx
    │   │   │   ├── ScheduleEditor.jsx
    │   │   │   └── BookingsList.jsx
    │   │   └── common/
    │   │       ├── Layout.jsx
    │   │       ├── LoadingSpinner.jsx
    │   │       └── ErrorMessage.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── BookingContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useBooking.js
    │   │   └── useApi.js
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── BookingPage.jsx
    │   │   ├── AdminLogin.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── auth.js
    │   ├── utils/
    │   │   └── constants.js
    │   ├── App.jsx
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    └── package.json
```

## Database Schema (PostgreSQL)

```sql
-- Create database
CREATE DATABASE beaubook;

-- Use UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admins table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    specialties TEXT[],
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff schedules table
CREATE TABLE staff_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, day_of_week)
);

-- Staff breaks table
CREATE TABLE staff_breaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_ref VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    staff_id UUID NOT NULL REFERENCES staff(id),
    service_id UUID NOT NULL REFERENCES services(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no-show')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Business settings table
CREATE TABLE business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    business_address TEXT,
    business_phone VARCHAR(20),
    business_email VARCHAR(255),
    opening_time TIME DEFAULT '09:00',
    closing_time TIME DEFAULT '18:00',
    booking_buffer_minutes INTEGER DEFAULT 15,
    max_advance_booking_days INTEGER DEFAULT 30,
    timezone VARCHAR(50) DEFAULT 'America/Vancouver',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_date_staff ON bookings(booking_date, staff_id);
CREATE INDEX idx_bookings_email ON bookings(customer_email);
CREATE INDEX idx_bookings_status_date ON bookings(status, booking_date);
CREATE INDEX idx_staff_schedules_staff_day ON staff_schedules(staff_id, day_of_week);

-- Create update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_settings_updated_at BEFORE UPDATE ON business_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO business_settings (business_name, business_email, business_phone, business_address)
VALUES ('BeauBook Salon', 'info@beaubook.com', '(555) 123-4567', '123 Beauty Lane, Vancouver, BC');

-- Insert sample admin (password: admin123)
INSERT INTO admins (email, password_hash, name)
VALUES ('admin@beaubook.com', '$2b$10$YourHashedPasswordHere', 'Admin User');

-- Insert sample services
INSERT INTO services (name, description, duration_minutes, price, category) VALUES
('Haircut', 'Professional haircut and styling', 45, 45.00, 'Hair'),
('Hair Color', 'Full hair coloring service', 120, 95.00, 'Hair'),
('Manicure', 'Classic manicure treatment', 30, 35.00, 'Nails'),
('Pedicure', 'Relaxing pedicure treatment', 45, 45.00, 'Nails'),
('Facial', 'Rejuvenating facial treatment', 60, 75.00, 'Skin'),
('Massage', 'Full body relaxation massage', 60, 85.00, 'Body');

-- Insert sample staff
INSERT INTO staff (name, email, phone) VALUES
('Sarah Johnson', 'sarah@beaubook.com', '(555) 234-5678'),
('Emily Chen', 'emily@beaubook.com', '(555) 345-6789'),
('Michael Brown', 'michael@beaubook.com', '(555) 456-7890');

-- Insert sample schedules (Mon-Fri 9AM-6PM for all staff)
INSERT INTO staff_schedules (staff_id, day_of_week, start_time, end_time)
SELECT id, day, '09:00', '18:00'
FROM staff
CROSS JOIN generate_series(1, 5) AS day;
```

## Backend Implementation Steps

### 1. Initialize Backend Project

```bash
cd backend
npm init -y
npm install express cors dotenv bcrypt jsonwebtoken
npm install pg pg-hstore
npm install nodemailer
npm install express-validator
npm install express-rate-limit
npm install helmet
npm install --save-dev nodemon
```

### 2. Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/beaubook
DB_HOST=localhost
DB_PORT=5432
DB_NAME=beaubook
DB_USER=your_user
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email (using Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin
DEFAULT_ADMIN_EMAIL=admin@beaubook.com
DEFAULT_ADMIN_PASSWORD=admin123
```

## Frontend Implementation Steps

### 1. Initialize React Project

```bash
npx create-react-app frontend
cd frontend
npm install axios react-router-dom
npm install tailwindcss@latest postcss@latest autoprefixer@latest
npm install @headlessui/react @heroicons/react
npm install date-fns
npm install react-hot-toast
npx tailwindcss init -p
```

### 2. Frontend Environment Variables (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BUSINESS_NAME=BeauBook Salon
```

## Key Features Implementation

### Availability Algorithm

The availability system needs to:

1. Check staff working hours for the selected date
2. Subtract existing bookings
3. Subtract break times
4. Generate available time slots based on service duration
5. Ensure no double bookings

### Booking Flow

1. Customer selects a service
2. Customer selects a staff member (or "Any Available")
3. Customer picks a date
4. System shows available time slots
5. Customer fills in contact information
6. System creates booking and sends email confirmation

### Admin Features

1. **Staff Management**

   - Add/edit/delete staff members
   - Set individual working schedules
   - Assign services to staff

2. **Schedule Management**

   - Set working hours per day
   - Add break times
   - Block out dates for holidays

3. **Service Management**

   - Add/edit/delete services
   - Set duration and pricing
   - Categorize services

4. **Booking Management**
   - View all bookings in calendar or list view
   - Update booking status
   - Cancel bookings with email notification

## Deployment Instructions

### Database Setup (Supabase)

1. Create account at https://supabase.com
2. Create new project
3. Go to SQL Editor
4. Run the database schema SQL
5. Copy connection string from Settings > Database

### Backend Deployment (Render)

1. Push code to GitHub
2. Create account at https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add environment variables
6. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Create account at https://vercel.com
3. Import GitHub repository
4. Configure:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Add environment variable: `REACT_APP_API_URL`
5. Deploy

## Testing Checklist

### Customer Flow

- [ ] Can view business information
- [ ] Can browse services
- [ ] Can select service and staff
- [ ] Can see available time slots
- [ ] Can book appointment
- [ ] Receives email confirmation
- [ ] Can view booking with reference number

### Admin Flow

- [ ] Can login securely
- [ ] Can add/edit/delete staff
- [ ] Can manage staff schedules
- [ ] Can add/edit/delete services
- [ ] Can view all bookings
- [ ] Can update booking status
- [ ] Schedule changes reflect immediately on customer interface

### Edge Cases

- [ ] Prevents double booking
- [ ] Handles timezone correctly
- [ ] Validates all input data
- [ ] Shows appropriate error messages
- [ ] Mobile responsive design
- [ ] Works across browsers

## Security Checklist

- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens expire appropriately
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CORS properly configured
- [ ] Rate limiting on API
- [ ] HTTPS in production
- [ ] Environment variables secured
- [ ] Admin routes protected

## Performance Optimization

1. **Database**

   - Use indexes for frequent queries
   - Connection pooling
   - Prepared statements

2. **Backend**

   - Response caching for services/staff lists
   - Compression middleware
   - Async/await for all database operations

3. **Frontend**
   - Lazy loading for admin routes
   - Memoization for expensive components
   - Debounce API calls
   - Optimistic UI updates

## Common Issues & Solutions

### Issue: Email not sending

**Solution:** Use app-specific password for Gmail or use SendGrid

### Issue: Timezone confusion

**Solution:** Store all times in UTC, convert on frontend based on business timezone

### Issue: Double bookings occurring

**Solution:** Use database transactions and row-level locking

### Issue: Slow availability calculation

**Solution:** Cache staff schedules, use database indexes

## Next Steps After MVP

1. **Customer Features**

   - Customer accounts
   - Booking history
   - Rescheduling capability
   - Cancellation policy

2. **Admin Features**

   - Analytics dashboard
   - Revenue reports
   - Staff performance metrics
   - Automated reminders

3. **Technical Improvements**
   - Real-time updates with WebSockets
   - PWA for mobile
   - Automated testing
   - CI/CD pipeline

## Support Resources

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Express.js Guide: https://expressjs.com/
- React Docs: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- Supabase Docs: https://supabase.com/docs
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
