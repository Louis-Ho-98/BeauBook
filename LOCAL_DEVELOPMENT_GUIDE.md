# BeauBook Local Development Guide

This guide will help you set up and run the BeauBook application locally on your machine.

## Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- **PostgreSQL** database (or Docker for containerized setup)
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/beaubook.git
cd BeauBook
```

### 2. Database Setup

#### Option A: Using PostgreSQL Locally

1. Install PostgreSQL if not already installed:

   - Mac: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`
   - Windows: Download from https://www.postgresql.org/download/windows/

2. Create the database:

```bash
psql -U postgres
CREATE DATABASE beaubook;
\q
```

#### Option B: Using Docker

```bash
docker run --name beaubook-db \
  -e POSTGRES_DB=beaubook \
  -e POSTGRES_USER=beaubook \
  -e POSTGRES_PASSWORD=beaubook123 \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Backend Setup (TypeScript)

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update the following:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/beaubook
# Or if using Docker:
# DATABASE_URL=postgresql://beaubook:beaubook123@localhost:5432/beaubook

# Server
PORT=5000
NODE_ENV=development

# JWT Secrets (generate random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this

# Admin Credentials
DEFAULT_ADMIN_EMAIL=admin@beaubook.com
DEFAULT_ADMIN_PASSWORD=admin123

# Frontend URL
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Start the Backend Server

```bash
# Development mode with hot reload
npm run dev

# Or production mode
npm run build
npm start
```

The backend API will be available at `http://localhost:5000`

### 4. Frontend Setup (React TypeScript)

Open a new terminal window/tab:

```bash
cd frontend-react
npm install
```

#### Configure Frontend Environment

Create a `.env` file:

```bash
touch .env
```

Add the following:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Development Workflow

### Running Both Servers Simultaneously

You can use two terminal windows or use a tool like `concurrently`:

#### Option 1: Two Terminals

Terminal 1 (Backend):

```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):

```bash
cd frontend-react
npm run dev
```

#### Option 2: Using Concurrently (from root directory)

First, create a `package.json` in the root directory:

```json
{
  "name": "beaubook",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend-react && npm run dev",
    "install:all": "npm run install:backend && npm run install:frontend",
    "install:backend": "cd backend && npm install",
    "install:frontend": "cd frontend-react && npm install"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

Then run:

```bash
npm install
npm run install:all
npm run dev
```

## Database Management

### Run Migrations (First Time Setup)

The database tables will be automatically created when you first run the backend server. The initialization script will:

- Create all necessary tables
- Set up the default admin account
- Add sample services and staff

### Reset Database

If you need to reset the database:

```bash
psql -U postgres -d beaubook
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
\q
```

Then restart the backend server to recreate tables.

## Testing the Application

### 1. Customer Booking Flow

1. Open `http://localhost:3000`
2. Click "Book Now"
3. Select a service
4. Choose a professional
5. Pick a date and time
6. Enter contact information
7. Confirm booking

### 2. Admin Dashboard

1. Navigate to `http://localhost:3000/admin`
2. Login with:
   - Email: `admin@beaubook.com`
   - Password: `admin123`
3. Test features:
   - View bookings
   - Manage staff
   - Manage services
   - Update schedules

## Common Issues & Solutions

### Issue: Cannot connect to database

**Solution:**

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### Issue: CORS errors in browser

**Solution:**

- Check `ALLOWED_ORIGINS` in backend `.env`
- Ensure frontend URL matches exactly
- Restart backend server after changes

### Issue: "Module not found" errors

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use

**Solution:**

```bash
# Find process using port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Find process using port 3000 (frontend)
lsof -i :3000
kill -9 <PID>
```

## Development Tips

### Hot Reload

- **Frontend:** Vite provides automatic hot module replacement
- **Backend:** Nodemon watches for file changes and restarts server

### Database GUI Tools

For easier database management, consider using:

- **pgAdmin**: https://www.pgadmin.org/
- **TablePlus**: https://tableplus.com/
- **DBeaver**: https://dbeaver.io/

### VS Code Extensions

Recommended extensions for development:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- PostgreSQL
- Thunder Client (API testing)

### API Testing

Test API endpoints using:

- **Thunder Client** (VS Code extension)
- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/

Example API calls:

```bash
# Get all services
curl http://localhost:5000/api/services

# Create a booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "555-0123",
    "staff_id": "staff-uuid-here",
    "service_id": "service-uuid-here",
    "booking_date": "2024-03-20",
    "start_time": "14:00"
  }'

# Admin login
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@beaubook.com",
    "password": "admin123"
  }'
```

## Build for Production

### Backend

```bash
cd backend
npm run build
# Output will be in dist/ folder
```

### Frontend

```bash
cd frontend-react
npm run build
# Output will be in dist/ folder
```

## Debugging

### Enable Debug Logs

Backend:

```bash
DEBUG=* npm run dev
```

Frontend:

- Open browser DevTools
- Check Console and Network tabs

### Database Queries

To see SQL queries in the backend:

- Set `logging: true` in `backend/src/config/database.ts`

## Next Steps

1. **Set up CI/CD**: Configure GitHub Actions for automated testing
2. **Add tests**: Write unit and integration tests
3. **Configure monitoring**: Set up error tracking (e.g., Sentry)
4. **Add documentation**: Generate API documentation with Swagger

## Support

If you encounter issues not covered in this guide:

1. Check the error logs in both terminals
2. Review the `.env` configuration
3. Ensure all dependencies are installed
4. Try clearing browser cache and cookies

Happy coding! 🚀
