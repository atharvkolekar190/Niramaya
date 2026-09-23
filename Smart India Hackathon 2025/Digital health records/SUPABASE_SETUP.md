# Supabase Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Choose your organization
5. Enter project name: "rural-healthcare"
6. Set database password : Ishu@123nov
7. Choose region (closest to your users)
8. Click "Create new project"

### 2. Get Your Credentials
1. Go to Settings > API
2. Copy your:
   - **Project URL** (SUPABASE_URL) = https://your-project-ref.supabase.co
   - **anon public** key (SUPABASE_ANON_KEY) = your-anon-key-here
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY) = your-service-role-key-here

### 3. Set Up Database
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to create all tables and policies

### 4. Set Up File Storage
1. Go to Storage in Supabase dashboard
2. The `health-documents` bucket should be created automatically
3. If not, create it manually with public access

### 5. Configure Environment Variables
Create a `.env` file in the project root:

```env
# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here
PORT=3002

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

### 6. Test the Setup
```bash
# Install dependencies
npm install

# Start the server
JWT_SECRET=dev-secret-key PORT=3002 npm start
```

## 🎯 Features Enabled

✅ **Real Database** - PostgreSQL with real-time features
✅ **File Uploads** - Health documents stored in Supabase Storage
✅ **Authentication** - Built-in auth system
✅ **Row Level Security** - Data protection
✅ **CDN** - Fast file delivery
✅ **Scalability** - Production-ready

## 📁 File Structure

- `config/supabase.js` - Supabase client configuration
- `models/` - Updated models for Supabase
- `supabase-schema.sql` - Database schema
- `controllers/` - Updated controllers with file upload

## 🔧 API Endpoints

- `POST /api/records/upload` - Upload health record with file
- `POST /api/records/create` - Create health record without file
- `GET /api/records/:patient_id` - Get patient records
- `GET /api/records/record/:record_id` - Get specific record
- `DELETE /api/records/:record_id` - Delete record and file

## 🚀 Next Steps

1. Set up your Supabase project
2. Update the `.env` file with your credentials
3. Run the database schema
4. Test file uploads
5. Deploy to production!

## 💡 Benefits

- **No more static data** - Real database persistence
- **File uploads** - Store health documents securely
- **Real-time** - Live updates across devices
- **Scalable** - Handle thousands of users
- **Secure** - Row-level security policies
