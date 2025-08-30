# Etheya Fashion Admin Panel Setup Guide

This guide will help you set up the comprehensive admin panel for your Etheya Fashion website with Supabase backend.

## Features

The admin panel provides complete control over:

- ✅ **Hero Section Management** - Upload and manage homepage hero images with content
- ✅ **Category Management** - Create, edit, and organize product categories
- ✅ **Product Management** - Full CRUD operations for products with multiple images
- ✅ **Image Upload** - Supabase Storage integration for all images
- ✅ **Admin Authentication** - Secure admin-only access
- ✅ **Dashboard** - Overview of all site content and analytics
- ✅ **Responsive Design** - Works on desktop and mobile devices

## Prerequisites

- Supabase account (free tier available)
- Node.js and npm installed
- Your Etheya Fashion project

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned (2-3 minutes)
3. Note down your project URL and anon key from Settings > API

## Step 2: Set Up Database

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire content of `supabase-schema.sql` into the editor
4. Click "Run" to create all tables, policies, and storage buckets

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin Configuration
ADMIN_EMAIL=admin@etheya.com
ADMIN_PASSWORD=your-secure-password

# Security
NEXTAUTH_SECRET=your-random-secret-string
NEXTAUTH_URL=http://localhost:3000
```

**Important:** Replace the placeholder values with your actual Supabase credentials.

## Step 4: Create Your First Admin User

### Option A: Using Supabase Dashboard (Recommended)

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user"
3. Enter your admin email and password
4. Make sure "Auto Confirm User" is checked
5. Click "Create user"
6. Copy the user ID from the user list

### Option B: Using SQL (Advanced)

```sql
-- Replace with your actual email and user ID
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'admin@etheya.com',
  crypt('your-password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  FALSE,
  'authenticated'
);
```

### Add to Admin Users Table

After creating the auth user, add them to the admin_users table:

```sql
-- Replace 'user-id-here' with the actual user ID from step 4
INSERT INTO admin_users (id, email) 
VALUES ('user-id-here', 'admin@etheya.com');
```

## Step 5: Install Dependencies

The required dependencies should already be installed. If not, run:

```bash
npm install @supabase/supabase-js @supabase/ssr react-dropzone --legacy-peer-deps
```

## Step 6: Start the Development Server

```bash
npm run dev
```

## Step 7: Access the Admin Panel

1. Open your browser and go to `http://localhost:3000/admin/login`
2. Enter your admin credentials
3. You should be redirected to the admin dashboard

## Admin Panel Structure

### 📊 Dashboard (`/admin`)
- Overview statistics
- Recent products and categories
- Quick action buttons
- System status alerts

### 🖼️ Hero Section (`/admin/hero`)
- Manage homepage hero slides
- Upload new hero images
- Edit content (title, subtitle, button text)
- Set content position (left/right)
- Activate/deactivate slides
- Reorder slides

### 📁 Categories (`/admin/categories`)
- View all product categories
- Create new categories
- Edit existing categories
- Upload category images
- Set featured status
- SEO-friendly slugs

### 📦 Products (`/admin/products`)
- Complete product management
- Multiple image uploads
- Size and color variants
- Stock management
- Featured products
- Category assignment

### 👥 Admin Users (`/admin/users`)
- Manage admin accounts
- Add/remove admin access
- View admin activity

### ⚙️ Settings (`/admin/settings`)
- Site configuration
- SEO settings
- General preferences

## File Upload System

The admin panel uses Supabase Storage with three buckets:

- `hero-images` - Homepage hero section images
- `category-images` - Product category images  
- `product-images` - Product photos and variants

### Supported Formats
- JPEG, PNG, WebP, GIF
- Maximum file size: 5MB
- Recommended dimensions:
  - Hero images: 1920x1080
  - Category images: 800x600
  - Product images: 800x800

## Security Features

- Row Level Security (RLS) enabled on all tables
- Admin-only access to management functions
- Secure image upload with validation
- Protected API routes
- Session-based authentication

## Updating Your Frontend

To display dynamic content from the admin panel, update your components to fetch from Supabase:

### Hero Section Example

```typescript
// Update components/hero-section.tsx to use Supabase data
import { supabase } from '@/lib/supabase'

const { data: heroImages } = await supabase
  .from('hero_images')
  .select('*')
  .eq('active', true)
  .order('order_index')
```

### Categories Example

```typescript
// Update category components to use Supabase data
const { data: categories } = await supabase
  .from('categories')
  .select('*')
  .eq('featured', true)
  .order('created_at', { ascending: false })
```

## Troubleshooting

### Common Issues

1. **Can't login to admin panel**
   - Check that the user exists in both `auth.users` and `admin_users` tables
   - Verify environment variables are correct
   - Ensure user email is confirmed

2. **Images not uploading**
   - Check storage buckets exist in Supabase
   - Verify storage policies are set correctly
   - Check file size and format

3. **Database connection errors**
   - Verify Supabase URL and keys in `.env.local`
   - Check that database schema was applied correctly

### Getting Help

1. Check the browser console for JavaScript errors
2. Check Supabase logs in the dashboard
3. Verify all environment variables are set
4. Ensure you're using the latest Next.js version

## Production Deployment

When deploying to production:

1. Update `NEXTAUTH_URL` in environment variables
2. Use production Supabase keys
3. Set up proper domain for image URLs
4. Configure CORS settings in Supabase if needed

## Next Steps

After setup, you can:

1. Customize the admin panel styling
2. Add more content management features
3. Set up automated backups
4. Add analytics and reporting
5. Implement advanced user roles

The admin panel is fully functional and ready for production use!
