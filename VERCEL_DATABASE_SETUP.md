# Vercel Database Setup Guide

## ⚠️ Important: SQLite Won't Work on Vercel

SQLite is a file-based database that requires write access to the filesystem. **Vercel's filesystem is read-only** except during build time, which means:

- ❌ SQLite databases cannot be written to on Vercel
- ❌ Database changes won't persist between deployments
- ❌ Your app will fail when trying to write data

## ✅ Solution: Use PostgreSQL on Vercel

You need to use a cloud database for Vercel deployments. The recommended option is **Vercel Postgres**.

## Step 1: Set Up Vercel Postgres

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
   - After creation, go to the **.env.local** tab in your project settings
   - Vercel will automatically add `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`
   - Copy the `POSTGRES_PRISMA_URL` value

## Step 2: Update Prisma Schema

Update `prisma/schema.prisma` to support PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Note:** You can keep SQLite for local development by using different `.env` files.

## Step 3: Configure Environment Variables

### On Vercel:
1. Go to **Project Settings** → **Environment Variables**
2. Add `DATABASE_URL` with the value from `POSTGRES_PRISMA_URL`
3. Make sure it's set for **Production**, **Preview**, and **Development**

### Local Development:
Keep your `.env` file with SQLite:
```env
DATABASE_URL="file:./prisma/dev.db"
```

## Step 4: Update Database Schema

After switching to PostgreSQL, you need to:

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
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

### Option B: Use Vercel Environment Variables
Set `DATABASE_URL` in Vercel dashboard, and it will override your local `.env` file.

## Alternative: Other Cloud Databases

If you prefer not to use Vercel Postgres, you can use:

- **Supabase** (Free tier available)
- **Neon** (Serverless Postgres, free tier)
- **Railway** (PostgreSQL)
- **PlanetScale** (MySQL)

Just update `DATABASE_URL` in Vercel environment variables.

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

- [ ] Created Vercel Postgres database
- [ ] Updated `DATABASE_URL` in Vercel environment variables
- [ ] Updated Prisma schema to use `postgresql`
- [ ] Ran `npm run db:generate`
- [ ] Ran `npx prisma db push`
- [ ] Ran `npm run db:seed`
- [ ] Tested deployment
