# BeauBook Deployment Guide

This guide will walk you through deploying your BeauBook application with free hosting services.

## Prerequisites

- GitHub account (for code repository)
- Supabase account (for PostgreSQL database)
- Vercel account (for frontend hosting)
- Render account (for backend hosting)

## Step 1: Set Up GitHub Repository

1. Create a new repository on GitHub called `beaubook`
2. Initialize git in your local BeauBook folder:

```bash
cd BeauBook
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/beaubook.git
git push -u origin main
```

## Step 2: Set Up PostgreSQL Database on Supabase

### Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Name it "beaubook" and choose a strong database password
4. Select the region closest to you
5. Wait for the project to be created

### Initialize Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Create a new query and paste the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables (use the schema from IMPLEMENTATION_GUIDE.md)
-- Copy the entire database schema SQL from the implementation guide

-- Note: Supabase automatically handles created_at and updated_at
```

3. Run the query to create all tables
4. Go to Settings > Database
5. Copy the connection string (it will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)

## Step 3: Deploy Backend to Render

### Prepare Backend for Deployment

1. Create a `.env` file in the backend folder (copy from `.env.example`):

```env
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=generate-a-random-string-here
JWT_REFRESH_SECRET=generate-another-random-string-here
DEFAULT_ADMIN_EMAIL=admin@beaubook.com
DEFAULT_ADMIN_PASSWORD=choose-a-secure-password
```

### Deploy to Render

1. Go to [https://render.com](https://render.com)
2. Sign up/login with your GitHub account
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:

   - **Name**: beaubook-api
   - **Root Directory**: BeauBook/backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables:

   - Click "Environment" tab
   - Add all variables from your `.env` file:
     - `DATABASE_URL` - Your Supabase connection string
     - `JWT_SECRET` - Generate a random string
     - `JWT_REFRESH_SECRET` - Generate another random string
     - `NODE_ENV` - Set to `production`
     - `FRONTEND_URL` - Will be added after frontend deployment
     - `ALLOWED_ORIGINS` - Will be added after frontend deployment

7. Click "Create Web Service"
8. Wait for deployment (this may take 5-10 minutes)
9. Once deployed, copy your backend URL (e.g., `https://beaubook-api.onrender.com`)

## Step 4: Deploy Frontend to Vercel

### Update Frontend Configuration

1. Update `BeauBook/frontend/app.js` to use environment variable for API URL:

Add at the top of app.js:

```javascript
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5020/api"
    : "https://beaubook-api.onrender.com/api";
```

Then replace all API calls to use this variable.

### Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:

   - **Framework Preset**: Other
   - **Root Directory**: BeauBook/frontend
   - **Build Command**: Leave empty (we're using static files)
   - **Output Directory**: ./

6. Add Environment Variables:

   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://beaubook-api.onrender.com`)

7. Click "Deploy"
8. Once deployed, copy your frontend URL (e.g., `https://beaubook.vercel.app`)

## Step 5: Update Backend CORS Settings

1. Go back to Render dashboard
2. Go to your beaubook-api service
3. Go to "Environment" tab
4. Update these environment variables:

   - `FRONTEND_URL`: Your Vercel frontend URL
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL (comma-separated if multiple)

5. Render will automatically redeploy with the new settings

## Step 6: Test Your Deployment

### Test Customer Booking Flow

1. Open your frontend URL (e.g., `https://beaubook.vercel.app`)
2. Try booking an appointment:
   - Select a service
   - Choose a professional
   - Pick a date and time
   - Enter contact information
   - Confirm booking

### Test Admin Dashboard

1. Click "Admin" in the navigation
2. Login with:

   - Email: admin@beaubook.com
   - Password: The password you set in DEFAULT_ADMIN_PASSWORD

3. Test admin features:
   - View bookings
   - Manage staff
   - Manage services
   - Update schedules

## Step 7: Custom Domain (Optional)

### For Frontend (Vercel)

1. Go to your project settings in Vercel
2. Go to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### For Backend (Render)

1. Go to your service settings in Render
2. Go to "Custom Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Database Connection Issues

- Verify your DATABASE_URL is correct
- Check if Supabase project is active
- Ensure you're using the correct password

### CORS Errors

- Verify ALLOWED_ORIGINS includes your frontend URL
- Check that the frontend is using the correct API URL
- Ensure the backend has redeployed after environment changes

### Admin Login Issues

- Check DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD are set
- Try redeploying the backend to reinitialize the database
- Check Render logs for any errors

### Slow Initial Load

- Free tier services may sleep after inactivity
- First request may take 30-60 seconds to wake up
- Consider upgrading to paid tier for always-on service

## Monitoring

### Backend Logs (Render)

1. Go to your Render dashboard
2. Select your service
3. Click "Logs" to view real-time logs

### Database Monitoring (Supabase)

1. Go to your Supabase dashboard
2. Check "Database" for query performance
3. Use "SQL Editor" to run queries directly

### Frontend Analytics (Vercel)

1. Go to your Vercel dashboard
2. Select your project
3. View "Analytics" for performance metrics

## Maintenance

### Updating the Application

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub:

```bash
git add .
git commit -m "Your update message"
git push
```

4. Both Vercel and Render will automatically redeploy

### Database Backups

1. Go to Supabase dashboard
2. Go to "Settings" > "Backups"
3. Download backups regularly
4. Consider setting up automated backups

### Scaling Considerations

When ready to scale beyond free tier:

1. **Database**: Upgrade Supabase plan for more storage and connections
2. **Backend**: Upgrade Render plan for more RAM and always-on service
3. **Frontend**: Vercel free tier is usually sufficient for most projects

## Support

For issues specific to:

- **Database**: Check Supabase documentation and Discord
- **Backend hosting**: Check Render documentation and community forum
- **Frontend hosting**: Check Vercel documentation and GitHub discussions
- **Application bugs**: Check the application logs and error messages

## Conclusion

Your BeauBook application is now live and accessible to the public!

**Live URLs:**

- Frontend: `https://[your-project].vercel.app`
- Backend API: `https://[your-project].onrender.com`
- API Documentation: `https://[your-project].onrender.com/`

Remember to:

- Regularly check logs for errors
- Monitor database usage
- Keep dependencies updated
- Make regular backups
- Test new features thoroughly before deploying
