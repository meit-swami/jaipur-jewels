# Complete Guide: Export Data & Connect to Vercel

## 📋 Overview

This guide will help you:
1. ✅ Export your current SQLite data
2. ✅ Set up PostgreSQL on Vercel
3. ✅ Import your data to Vercel
4. ✅ Keep SQLite for local development

---

## Step 1: Export Your Current Data

### Run the export script:

```bash
npm run db:export
```

This will create a `data-export.json` file in your project root with all your:
- Categories
- Products (with images and videos)
- Deep Links

**✅ Check:** You should see `data-export.json` in your project root.

---

## Step 2: Set Up MySQL on Vercel

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

4. **Add DATABASE_URL to Vercel**
   - Go to your Vercel project → **Settings** → **Environment Variables**
   - Click **Add New**
   - Key: `DATABASE_URL`
   - Value: Paste the MySQL connection string from PlanetScale
   - Select: **Production**, **Preview**, and **Development**
   - Click **Save**

### Option B: Alternative Cloud Databases

If you prefer other options:

- **PlanetScale** (MySQL - Recommended): https://planetscale.com
- **Railway** (MySQL or PostgreSQL): https://railway.app
- **Supabase** (PostgreSQL): https://supabase.com
- **Neon** (PostgreSQL): https://neon.tech

Just get the connection string and add it as `DATABASE_URL` in Vercel.

---

## Step 3: Update Prisma Schema for MySQL

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Note:** If you're using PostgreSQL instead, use `provider = "postgresql"`

**Important:** Keep your local `.env` with SQLite for development:
```env
DATABASE_URL="file:./dev.db"
```

Vercel will use PostgreSQL automatically via environment variables.

---

## Step 4: Generate Prisma Client for PostgreSQL

```bash
npm run db:generate
```

This generates the Prisma client for PostgreSQL.

---

## Step 5: Push Schema to Vercel Database

**⚠️ Important:** Before running this, make sure:
- ✅ PostgreSQL database is created on Vercel
- ✅ `DATABASE_URL` is set in Vercel environment variables
- ✅ You're connected to Vercel database

### Option A: Push from Local (Recommended)

1. **Temporarily update your local `.env`:**
   ```env
   DATABASE_URL="your-vercel-mysql-url-here"
   ```

2. **Push schema:**
   ```bash
   npm run db:push
   ```

3. **Import your data:**
   ```bash
   npm run db:import
   ```

4. **Revert `.env` back to SQLite:**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

### Option B: Push During Vercel Build

Add to `package.json` build script (already done):
```json
"build": "prisma generate && prisma db push && next build"
```

But this won't import data. You'll need to import manually after first deployment.

---

## Step 6: Import Data to Vercel

### Method 1: Import Script (Recommended)

1. **Set DATABASE_URL temporarily:**
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="your-vercel-mysql-url"
   npm run db:import
   ```

2. **Or create `.env.vercel` temporarily:**
   ```env
   DATABASE_URL="your-vercel-mysql-url"
   ```
   Then run:
   ```bash
   # Copy to .env temporarily
   Copy-Item .env.vercel .env
   npm run db:import
   # Restore original
   Copy-Item .env.backup .env
   ```

### Method 2: Use Prisma Studio with Vercel URL

1. Set `DATABASE_URL` to your MySQL connection string
2. Run: `npx prisma studio`
3. Manually import via UI

### Method 3: Use Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Import data
npm run db:import
```

---

## Step 7: Verify Everything Works

### Test Locally (SQLite):
```bash
npm run dev
```
- Should work with your local SQLite database
- Data should load correctly

### Test on Vercel:
1. Push your code to GitHub
2. Vercel will automatically deploy
3. Check your Vercel deployment URL
4. Data should load from MySQL

---

## Step 8: Keep Both Databases Working

### Local Development (SQLite):
Your `.env` file:
```env
DATABASE_URL="file:./dev.db"
```

### Vercel Production (MySQL):
Vercel environment variables:
```env
DATABASE_URL="mysql://..."
```

The app will automatically use the correct database based on where it's running!

---

## Troubleshooting

### ❌ "Table does not exist" Error
**Solution:** Run `npx prisma db push` with PostgreSQL URL

### ❌ "Connection refused" Error
**Solution:** 
- Check PostgreSQL database is not paused
- Verify `DATABASE_URL` is correct in Vercel
- Check database region matches your deployment

### ❌ Data not showing on Vercel
**Solution:**
- Verify data was imported: Check `data-export.json` exists
- Run import script with Vercel DATABASE_URL
- Check Vercel build logs for errors

### ❌ Local development broken
**Solution:**
- Make sure `.env` has SQLite URL: `DATABASE_URL="file:./dev.db"`
- Run: `npm run db:push` (for SQLite)
- Run: `npm run db:seed` (if needed)

---

## Quick Reference Commands

```bash
# Export current data
npm run db:export

# Import data (set DATABASE_URL first)
npm run db:import

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

---

## ✅ Checklist

- [ ] Exported data: `npm run db:export`
- [ ] Created MySQL database (PlanetScale or other provider)
- [ ] Added `DATABASE_URL` to Vercel environment variables
- [ ] Updated `prisma/schema.prisma` to `mysql`
- [ ] Generated Prisma client: `npm run db:generate`
- [ ] Pushed schema to Vercel: `npm run db:push` (with MySQL URL)
- [ ] Imported data to Vercel: `npm run db:import` (with MySQL URL)
- [ ] Tested locally (SQLite works)
- [ ] Tested on Vercel (MySQL works)
- [ ] Committed `data-export.json` to Git (optional backup)

---

## 📝 Notes

- **`data-export.json`** contains all your data - keep it as a backup!
- You can commit it to Git for version control
- The import script is idempotent - safe to run multiple times
- Local development continues using SQLite
- Vercel production uses MySQL automatically

---

**Need Help?** Check the error messages - they usually tell you exactly what's wrong!
