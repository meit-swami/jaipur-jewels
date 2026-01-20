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

## Step 2: Set Up PostgreSQL on Vercel

### Option A: Vercel Postgres (Recommended - Free Tier Available)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project: **jewellery**

2. **Create Postgres Database**
   - Click on the **Storage** tab
   - Click **Create Database**
   - Select **Postgres**
   - Name it: `jaipur-jewels-db`
   - Choose region (closest to your users)
   - Click **Create**

3. **Get Connection String**
   - After creation, go to **Settings** → **Environment Variables**
   - You'll see `POSTGRES_PRISMA_URL` automatically added
   - Copy this value

4. **Add DATABASE_URL**
   - In **Environment Variables**, click **Add New**
   - Key: `DATABASE_URL`
   - Value: Paste the `POSTGRES_PRISMA_URL` value
   - Select: **Production**, **Preview**, and **Development**
   - Click **Save**

### Option B: Alternative Cloud Databases

If you prefer other options:

- **Supabase** (Free tier): https://supabase.com
- **Neon** (Free tier): https://neon.tech
- **Railway**: https://railway.app

Just get the PostgreSQL connection string and add it as `DATABASE_URL` in Vercel.

---

## Step 3: Update Prisma Schema for PostgreSQL

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

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
   DATABASE_URL="your-vercel-postgres-url-here"
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
   $env:DATABASE_URL="your-vercel-postgres-url"
   npm run db:import
   ```

2. **Or create `.env.vercel` temporarily:**
   ```env
   DATABASE_URL="your-vercel-postgres-url"
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

1. Set `DATABASE_URL` to Vercel Postgres URL
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
4. Data should load from PostgreSQL

---

## Step 8: Keep Both Databases Working

### Local Development (SQLite):
Your `.env` file:
```env
DATABASE_URL="file:./dev.db"
```

### Vercel Production (PostgreSQL):
Vercel environment variables:
```env
DATABASE_URL="postgresql://..."
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
- [ ] Created PostgreSQL database on Vercel
- [ ] Added `DATABASE_URL` to Vercel environment variables
- [ ] Updated `prisma/schema.prisma` to `postgresql`
- [ ] Generated Prisma client: `npm run db:generate`
- [ ] Pushed schema to Vercel: `npm run db:push` (with Vercel URL)
- [ ] Imported data to Vercel: `npm run db:import` (with Vercel URL)
- [ ] Tested locally (SQLite works)
- [ ] Tested on Vercel (PostgreSQL works)
- [ ] Committed `data-export.json` to Git (optional backup)

---

## 📝 Notes

- **`data-export.json`** contains all your data - keep it as a backup!
- You can commit it to Git for version control
- The import script is idempotent - safe to run multiple times
- Local development continues using SQLite
- Vercel production uses PostgreSQL automatically

---

**Need Help?** Check the error messages - they usually tell you exactly what's wrong!
