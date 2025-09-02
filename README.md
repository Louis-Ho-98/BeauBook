# BeauBook - Beauty Salon Booking System

A modern, full-featured booking system for beauty salons and spas. Built with React, Node.js, Express, and PostgreSQL.

![BeauBook](https://img.shields.io/badge/BeauBook-MVP-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green)

## 🌟 Features

### Customer Features

- 📅 **Easy Booking Flow**: Browse services → Select professional → Choose time → Confirm
- 🎨 **Service Categories**: Hair, Nails, Skin, Body treatments
- 👥 **Staff Selection**: Choose your preferred professional or any available
- ⏰ **Real-time Availability**: See only available time slots
- 📧 **Booking Confirmation**: Get instant confirmation with booking reference
- 📱 **Mobile Responsive**: Works perfectly on all devices

### Admin Features

- 🔐 **Secure Dashboard**: JWT-based authentication
- 👨‍💼 **Staff Management**: Add, edit, remove staff members
- 📋 **Service Management**: Manage services, pricing, and duration
- 🗓️ **Schedule Management**: Set working hours and breaks for each staff
- 📊 **Booking Overview**: View and manage all bookings
- ⚙️ **Business Settings**: Configure business information

## 🚀 Quick Start

### Prerequisites

- Node.js 14+
- npm or yarn
- PostgreSQL database (or use Supabase free tier)

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/beaubook.git
cd BeauBook
```

2. **Setup Backend**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

3. **Setup Frontend**

```bash
cd ../frontend
# Open index.html in your browser
# Or use a local server:
python -m http.server 8080
```

4. **Access the Application**

- Frontend: http://localhost:8080
- Backend API: http://localhost:5020
- Admin Login: admin@beaubook.com / admin123

## 💻 Technology Stack

### Frontend

- **HTML5/CSS3/JavaScript**: Pure vanilla JS for simplicity
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional interface

### Backend

- **Node.js & Express**: RESTful API server
- **PostgreSQL**: Relational database with Sequelize ORM
- **JWT Authentication**: Secure admin access
- **Bcrypt**: Password hashing
- **Express Validator**: Input validation
- **Helmet & CORS**: Security middleware

## 📁 Project Structure

```
BeauBook/
├── frontend/           # Frontend application
│   ├── index.html     # Main HTML file
│   ├── styles.css     # Styling
│   └── app.js         # Application logic
├── backend/           # Backend API
│   ├── src/
│   │   ├── config/    # Database configuration
│   │   ├── models/    # Sequelize models
│   │   ├── routes/    # API routes
│   │   ├── middleware/# Auth & validation
│   │   ├── services/  # Business logic
│   │   └── utils/     # Helper functions
│   └── server.js      # Express server
└── docs/
    ├── ARCHITECTURE.md    # System design
    ├── IMPLEMENTATION.md  # Development guide
    └── DEPLOYMENT.md      # Deployment instructions
```

## 🌐 API Endpoints

### Public Endpoints

- `GET /api/services` - List all services
- `GET /api/staff` - List all staff members
- `POST /api/bookings/availability` - Check availability
- `POST /api/bookings` - Create booking
- `GET /api/bookings/ref/:booking_ref` - Get booking details

### Admin Endpoints (Auth Required)

- `POST /api/auth/admin/login` - Admin login
- `GET /api/admin/bookings` - List all bookings
- `POST /api/admin/staff` - Add staff member
- `PUT /api/admin/staff/:id/schedule` - Update schedule
- `POST /api/admin/services` - Add service

## 🚢 Deployment

### Free Hosting Options

#### Database: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run database schema in SQL editor
4. Copy connection string

#### Backend: Render

1. Push code to GitHub
2. Connect to [render.com](https://render.com)
3. Deploy as Web Service
4. Add environment variables

#### Frontend: Vercel

1. Import GitHub repo to [vercel.com](https://vercel.com)
2. Set root directory to `BeauBook/frontend`
3. Deploy

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔧 Configuration

### Environment Variables

Create `.env` file in backend directory:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/beaubook

# Server
PORT=5020
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-key

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email
EMAIL_PASS=your-password

# Frontend
FRONTEND_URL=http://localhost:8080
```

## 📱 Screenshots

### Customer Booking Flow

1. **Service Selection**: Choose from various beauty services
2. **Staff Selection**: Pick your preferred professional
3. **Time Selection**: View available slots in real-time
4. **Booking Confirmation**: Receive booking reference

### Admin Dashboard

1. **Overview**: See today's bookings and stats
2. **Staff Management**: Add/edit staff and schedules
3. **Service Management**: Manage service offerings
4. **Booking Management**: View and update bookings

## 🧪 Testing

### Manual Testing Checklist

- ✅ Customer can browse services
- ✅ Customer can select staff member
- ✅ Customer can see available time slots
- ✅ Customer can complete booking
- ✅ Admin can login securely
- ✅ Admin can manage staff
- ✅ Admin can manage services
- ✅ Admin can view bookings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built as an MVP for beauty salon businesses
- Inspired by modern booking systems like Fresha
- Uses best practices for scalable web applications

## 📞 Support

For support, email support@beaubook.com or open an issue on GitHub.

## 🚀 Future Enhancements

- [ ] Email/SMS notifications
- [ ] Online payment integration
- [ ] Customer accounts and history
- [ ] Recurring appointments
- [ ] Multi-location support
- [ ] Mobile applications
- [ ] Analytics dashboard
- [ ] Waitlist management

---

**Built with ❤️ for the beauty industry**
