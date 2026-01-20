# Vercel Database Setup Guide

## ⚠️ Important: SQLite Won't Work on Vercel

SQLite is a file-based database that requires write access to the filesystem. **Vercel's filesystem is read-only** except during build time, which means:

- ❌ SQLite databases cannot be written to on Vercel
- ❌ Database changes won't persist between deployments
- ❌ Your app will fail when trying to write data

## ✅ Solution: Use MySQL on Vercel

You need to use a cloud database for Vercel deployments. The recommended options are **PlanetScale** (MySQL) or **Vercel Postgres** (PostgreSQL).

## Step 1: Set Up MySQL Database

### Option A: PlanetScale (Recommended for MySQL - Free Tier Available)

1. **Sign up for PlanetScale**
   - Visit: https://planetscale.com
   - Sign up for a free account

2. **Create a Database**
   - Click **Create database**
   - Name it: `jaipur-jewels-db`
   - Choose a region closest to your users
   - Click **Create database**

3. **Get Connection String**
   - After creation, click **Connect**
   - Select **Prisma** from the connection options
   - Copy the connection string (starts with `mysql://`)

4. **Add to Vercel**
   - Go to your Vercel project → **Settings** → **Environment Variables**
   - Add `DATABASE_URL` with the PlanetScale connection string
   - Select: **Production**, **Preview**, and **Development**

### Option B: Vercel Postgres (PostgreSQL)

1. **Go to your Vercel Dashboard**
   - Navigate to your project: https://vercel.com/dashboard
   - Click on your project

2. **Add Vercel Postgres**
   - Go to the **Storage** tab
   - Click **Create Database**
   - Select **Postgres**
   - Choose a name (e.g., `jaipur-jewels-db`)
   - Select a region closest to your users
   - Click **Create**

3. **Get Connection String**
   - After creation, go to **Settings** → **Environment Variables**
   - You'll see `POSTGRES_PRISMA_URL` automatically added
   - Copy this value and add as `DATABASE_URL`

## Step 2: Update Prisma Schema

Update `prisma/schema.prisma` to support MySQL:

```prisma
datasource db {
  provider = "mysql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Note:** If using PostgreSQL instead, use `provider = "postgresql"`

**Note:** You can keep SQLite for local development by using different `.env` files.

## Step 3: Configure Environment Variables

### On Vercel:
1. Go to **Project Settings** → **Environment Variables**
2. Add `DATABASE_URL` with your MySQL connection string (from PlanetScale or other provider)
3. Make sure it's set for **Production**, **Preview**, and **Development**

### Local Development:
Keep your `.env` file with SQLite:
```env
DATABASE_URL="file:./dev.db"
```

**Note:** For local MySQL testing, you can use:
```env
DATABASE_URL="mysql://user:password@localhost:3306/jaipur_jewels"
```

## Step 4: Update Database Schema

After switching to MySQL, you need to:

1. **Generate Prisma Client:**
   ```bash
   npm run db:generate
   ```

2. **Push Schema to Database:**
   ```bash
   npx prisma db push
   ```

3. **Seed the Database:**
   ```bash
   npm run db:seed
   ```

## Step 5: Alternative: Use Different Databases for Dev/Prod

You can keep SQLite for local development and PostgreSQL for production:

### Option A: Use `.env.local` for Production Override
Create `.env.local` (don't commit this):
```env
DATABASE_URL="mysql://user:password@host:3306/dbname"
```

### Option B: Use Vercel Environment Variables
Set `DATABASE_URL` in Vercel dashboard, and it will override your local `.env` file.

## Alternative: Other Cloud Databases

If you prefer other options:

- **PlanetScale** (MySQL - Recommended, free tier available)
- **Railway** (MySQL or PostgreSQL)
- **Supabase** (PostgreSQL, free tier available)
- **Neon** (Serverless Postgres, free tier)
- **Vercel Postgres** (PostgreSQL)

Just update `DATABASE_URL` in Vercel environment variables and set the correct `provider` in `prisma/schema.prisma`.

## Troubleshooting

### Database Connection Errors
- Verify `DATABASE_URL` is set correctly in Vercel
- Check that the database is accessible (not paused)
- Ensure Prisma schema matches the database provider

### Migration Issues
- Run `npx prisma db push` to sync schema
- Use `npx prisma migrate dev` for production migrations

### Local Development
- Keep using SQLite locally with `DATABASE_URL="file:./prisma/dev.db"`
- The code will automatically use the correct database based on environment

## Quick Checklist

- [ ] Created MySQL database (PlanetScale or other provider)
- [ ] Updated `DATABASE_URL` in Vercel environment variables
- [ ] Updated Prisma schema to use `mysql`
- [ ] Ran `npm run db:generate`
- [ ] Ran `npx prisma db push`
- [ ] Ran `npm run db:import` (to import your existing data)
- [ ] Tested deployment
