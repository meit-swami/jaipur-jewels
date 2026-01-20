# Complete Instructions Guide - Jaipuri Jewels

## 📋 Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Running the Application](#running-the-application)
3. [Admin Panel Access](#admin-panel-access)
4. [Database Management](#database-management)
5. [API Keys & Configuration](#api-keys--configuration)
6. [Unique Features Explained](#unique-features-explained)
7. [Tech Stack Details](#tech-stack-details)
8. [AI/LLM Integration](#aillm-integration)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Installation & Setup

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd "D:\Meit Personal Project\Jewelery"

# Install all dependencies
npm install
```

**Expected Output:**
- Installs ~758 packages
- Creates `node_modules/` directory
- May show deprecation warnings (safe to ignore)

### Step 2: Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OpenAI API Key (for AI descriptions)
OPENAI_API_KEY="sk-proj-your-key-here"

# WhatsApp Integration
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"

# Admin Panel Password
NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
```

**Important Notes:**
- Replace `OPENAI_API_KEY` with your actual OpenAI API key
- Replace `NEXT_PUBLIC_WHATSAPP_NUMBER` with your WhatsApp number (country code + number, no + or spaces)
- Change `NEXT_PUBLIC_ADMIN_PASSWORD` for security

### Step 3: Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Create database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

**What This Does:**
- Creates SQLite database at `prisma/dev.db`
- Generates TypeScript types for database
- Creates 10 categories (Rings, Necklaces, Earrings, Bracelets, Anklets, Tiaras, Crowns, Pendants, Brooches, Hair Accessories)
- Adds 6 sample jewellery products
- Creates 8 deep links for Instagram bio

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in X seconds
```

---

## 🌐 Running the Application

### Development Mode

```bash
npm run dev
```

**Access Points:**
- **Homepage**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **Admin Login**: http://localhost:3000/admin/login
- **Bio Links**: http://localhost:3000/links
- **QR Landing**: http://localhost:3000/qr

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Using Different Port

```bash
# Windows PowerShell
$env:PORT=3001; npm run dev

# Linux/Mac
PORT=3001 npm run dev
```

---

## 🔐 Admin Panel Access

### Access URL
```
http://localhost:3000/admin/login
```

### Default Credentials
- **Password**: `admin123`

### Changing Admin Password

1. Open `.env` file
2. Update `NEXT_PUBLIC_ADMIN_PASSWORD`:
   ```env
   NEXT_PUBLIC_ADMIN_PASSWORD="your-secure-password"
   ```
3. Restart the development server

### Admin Panel Features

Once logged in, you can:
- **View All Products** - See all products in a table
- **Add New Product** - Create products with AI descriptions
- **Edit Products** - Update product details
- **Manage Stock** - Update stock counts and thresholds
- **Delete Products** - Remove products from catalog

### Admin Panel Workflow

1. **Login** → Enter password at `/admin/login`
2. **View Products** → See all products in table format
3. **Add Product** → Click "Add Product" button
4. **Fill Form**:
   - Product name
   - Price in INR (₹)
   - Category selection
   - Image URLs (at least one required)
   - Video URLs (optional)
   - Stock count and threshold
   - 3D model URL (optional, for AR)
5. **AI Generation** → Descriptions and tags auto-generated
6. **Save** → Product appears in catalog

---

## 💾 Database Management

### Database Technology

- **Type**: SQLite
- **Location**: `prisma/dev.db`
- **ORM**: Prisma
- **Schema File**: `prisma/schema.prisma`

### Database Schema

#### Categories Table
- Stores product categories (Rings, Necklaces, etc.)
- Includes slug, description, and ordering

#### Products Table
- Main product information
- Links to category
- Stores price, stock, descriptions
- AI-generated descriptions and tags

#### ProductImages Table
- Multiple images per product
- Ordering support
- 360° view flag

#### ProductVideos Table
- Product videos
- Thumbnail support

#### DeepLinks Table
- Instagram bio links
- Category-based filtering

### Importing Data into Database

#### Method 1: Using Seed Script (Recommended)

```bash
# Seed with default sample data
npm run db:seed
```

#### Method 2: Manual Import via Admin Panel

1. Login to admin panel
2. Click "Add Product"
3. Fill in product details
4. AI will generate description automatically

#### Method 3: Direct Database Import

```bash
# If you have a SQL file
sqlite3 prisma/dev.db < your-data.sql

# Or use Prisma Studio (GUI)
npx prisma studio
```

### Exporting Database

```bash
# Export to SQL
sqlite3 prisma/dev.db .dump > backup.sql

# Or use Prisma Studio
npx prisma studio
# Then export via GUI
```

### Resetting Database

```bash
# Delete database file
Remove-Item -Path "prisma\dev.db" -Force

# Recreate schema
npm run db:push

# Reseed data
npm run db:seed
```

### Switching to PostgreSQL/MySQL

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/jaipuri_jewels"
   ```

3. Run migrations:
   ```bash
   npm run db:push
   ```

---

## 🔑 API Keys & Configuration

### OpenAI API Key

**Purpose**: Generate AI-powered product descriptions

**How to Get:**
1. Visit https://platform.openai.com
2. Sign up or login
3. Go to API Keys section
4. Create new secret key
5. Copy and paste into `.env`

**Configuration:**
```env
OPENAI_API_KEY="sk-proj-your-actual-key-here"
```

**Usage:**
- Automatically used when creating products
- Generates premium descriptions and tags
- Falls back to custom descriptions if unavailable

**Cost**: Pay-per-use (GPT-4o-mini is cost-effective)

### WhatsApp Number

**Purpose**: Direct customer contact via WhatsApp

**Format**: Country code + number (no + or spaces)

**Examples:**
```env
# India
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"

# USA
NEXT_PUBLIC_WHATSAPP_NUMBER="15551234567"

# UK
NEXT_PUBLIC_WHATSAPP_NUMBER="447911123456"
```

**How It Works:**
- Customers click "Contact Us on WhatsApp"
- Fill in their details
- WhatsApp opens with pre-filled message
- Admin receives message directly

---

## ✨ Unique Features Explained

### 1. AI-Powered Product Descriptions

**Technology**: OpenAI GPT-4o-mini

**How It Works:**
1. Admin creates product with name, price, category
2. System sends product info to OpenAI API
3. GPT-4 generates premium, luxury-focused description
4. Also generates relevant tags for SEO
5. Description and tags saved to database

**Features:**
- 150-200 word descriptions
- Luxury-focused language
- Category-aware content
- Automatic tag generation
- Fallback descriptions if API unavailable

**File**: `lib/ai.ts`

### 2. AR/3D Try-On Experience

**Technology**: MediaPipe + Three.js + WebXR

**How It Works:**
1. User clicks "Try Live on Yourself"
2. Camera access requested
3. MediaPipe detects landmarks (face, hands, pose)
4. Three.js renders 3D jewellery model
5. Model positioned based on detected landmarks
6. Real-time tracking and rendering

**Category-Specific Logic:**
- **Rings**: Hand landmark detection → Finger positioning
- **Necklaces**: Face landmarks → Neck/collarbone positioning
- **Earrings**: Face landmarks → Ear positioning
- **Bracelets**: Hand landmarks → Wrist positioning
- **Anklets**: Pose landmarks → Ankle positioning
- **Tiaras/Crowns**: Face landmarks → Head positioning

**Files**: 
- `components/ARTryOnViewer.tsx`
- `lib/ar-manager.ts`
- `lib/mediapipe-detector.ts`

**See**: [README_AR.md](./README_AR.md) for detailed AR documentation

### 3. Real-Time Search with Suggestions

**Technology**: Client-side filtering + React state

**How It Works:**
1. User types in search box
2. After 2+ characters, suggestions appear
3. Searches product name, category, and price
4. Shows up to 5 matching products
5. Displays product image, name, category, price
6. Click suggestion to view product

**Features:**
- Instant results as you type
- Product previews with images
- Category badges
- Price display
- Smooth animations

**File**: `components/SearchSuggestions.tsx`

### 4. Advanced Filtering System

**Technology**: React state + URL parameters

**Filters Available:**
- **Price Range**: Dual-range slider (₹0 - ₹10,00,000)
- **Size**: Small, Medium, Large, Extra Large
- **Jewelry Type**: Gold, Silver, Platinum, Rose Gold, White Gold
- **Stones**: Diamond, Pearl, Ruby, Emerald, Sapphire, etc.

**How It Works:**
- Filters applied in real-time
- Products update instantly
- Multiple filters can be combined
- Clear all filters option

**File**: `components/ProductFilters.tsx`

### 5. 360° Product View

**Technology**: Three.js + React Three Fiber

**How It Works:**
1. Product image marked as 360° view
2. Three.js creates sphere with image as texture
3. User can drag to rotate
4. Scroll to zoom
5. Smooth animations

**File**: `components/ProductView360.tsx`

### 6. Video Auto-Play on Hover

**Technology**: HTML5 Video + CSS transitions

**How It Works:**
1. Product has associated video
2. On image hover, video fades in
3. Video auto-plays and loops
4. On hover end, video fades out
5. Smooth transitions

**File**: `components/ProductGrid.tsx`

### 7. WhatsApp Integration

**Technology**: WhatsApp Web API

**How It Works:**
1. User clicks "Contact Us on WhatsApp"
2. Form appears with fields:
   - Name (required)
   - Phone (required)
   - Email (optional)
   - Query (optional)
3. System builds WhatsApp message with:
   - Product name
   - Product ID
   - Price
   - User details
   - User query
4. Opens WhatsApp with pre-filled message
5. Admin receives message directly

**File**: `components/WhatsAppContact.tsx`

### 8. QR Code System

**Technology**: qrcode.react library

**How It Works:**
1. Generate QR code per product
2. QR contains product URL with `?ar=true`
3. Scanning QR opens product page
4. AR experience auto-launches
5. Useful for in-store displays

**File**: `components/QRCodeDisplay.tsx`

### 9. Instagram Bio Links

**Technology**: Dynamic routing + URL parameters

**How It Works:**
1. Admin creates deep links in database
2. Each link maps to category or featured products
3. Links displayed on `/links` page
4. Copy link to clipboard
5. Use in Instagram bio or social media

**File**: `app/links/page.tsx`

---

## 🛠️ Tech Stack Details

### Frontend Framework

**Next.js 15**
- **Why**: Latest React framework with App Router
- **Features Used**:
  - Server Components for SEO
  - API Routes for backend
  - Image optimization
  - Automatic code splitting
  - Built-in TypeScript support

### Styling

**Tailwind CSS**
- **Why**: Utility-first, fast development
- **Custom Theme**: Luxury ivory/gold color scheme
- **Responsive**: Mobile-first design
- **Custom Utilities**: Luxury shadows, glass effects

### 3D Graphics

**Three.js**
- **Why**: Industry-standard 3D library
- **Usage**: 
  - 360° product views
  - AR 3D model rendering
  - Product visualization

**React Three Fiber**
- **Why**: React wrapper for Three.js
- **Usage**: Declarative 3D scene management

### State Management

**TanStack Query (React Query)**
- **Why**: Powerful data fetching and caching
- **Usage**: Product data, categories, admin operations
- **Features**: Automatic refetching, caching, optimistic updates

**Zustand**
- **Why**: Lightweight state management
- **Status**: Installed, ready for use
- **Usage**: Can be used for global app state

### Database

**Prisma ORM**
- **Why**: Type-safe database access
- **Features**:
  - Auto-generated TypeScript types
  - Migration management
  - Query builder
  - Relationship handling

**SQLite**
- **Why**: Lightweight, no server needed
- **Production**: Can switch to PostgreSQL/MySQL easily
- **Location**: `prisma/dev.db`

### Form Handling

**React Hook Form**
- **Why**: Performant form library
- **Usage**: Admin product forms
- **Features**: Validation, error handling

### Validation

**Zod**
- **Why**: TypeScript-first schema validation
- **Usage**: API request validation
- **Features**: Type inference, error messages

### Icons

**Lucide React**
- **Why**: Beautiful, consistent icon set
- **Usage**: Throughout the application

---

## 🤖 AI/LLM Integration

### OpenAI GPT-4o-mini

**Model**: `gpt-4o-mini`

**Purpose**: Generate premium product descriptions

**API Endpoint**: `https://api.openai.com/v1/chat/completions`

**Implementation**: `lib/ai.ts`

**How It Works:**
```typescript
// System prompt sets context as luxury jewellery copywriter
// User prompt includes:
// - Product name
// - Category
// - Price
// - Additional details (if any)

// Response format:
{
  "description": "Premium 150-200 word description",
  "tags": ["tag1", "tag2", ...]
}
```

**Features:**
- Luxury-focused language
- Category-aware descriptions
- SEO-optimized tags
- Fallback if API unavailable

**Cost**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

**Rate Limits**: Depends on your OpenAI plan

### Fallback Behavior

If OpenAI API is unavailable:
- Uses custom template descriptions
- Still generates basic tags
- App continues to function normally

### Alternative AI Services

You can replace OpenAI with:
- **Anthropic Claude** - Similar capabilities
- **Google Gemini** - Free tier available
- **Local LLM** - For privacy (Ollama, etc.)

To switch, update `lib/ai.ts` with new API client.

---

## 📡 APIs Used

### External APIs

1. **OpenAI API**
   - **Purpose**: AI description generation
   - **Endpoint**: `https://api.openai.com/v1/chat/completions`
   - **Authentication**: API key in `.env`
   - **Rate Limits**: Based on plan

2. **WhatsApp Web API**
   - **Purpose**: Direct messaging
   - **Format**: `https://wa.me/{number}?text={message}`
   - **No API Key**: Uses WhatsApp Web protocol

3. **Google Fonts**
   - **Purpose**: Typography (Inter, Playfair Display)
   - **CDN**: Loaded from Google Fonts
   - **No API Key**: Public CDN

### Internal APIs (Next.js Routes)

1. **GET /api/products** - List products (with filters)
2. **GET /api/products/[slug]** - Get single product
3. **GET /api/categories** - List categories
4. **GET /api/deep-links** - Get bio links
5. **GET /api/admin/products** - List products (admin)
6. **POST /api/admin/products** - Create product
7. **PATCH /api/admin/products/[id]** - Update product
8. **DELETE /api/admin/products/[id]** - Delete product

---

## 🎯 How Features Work

### Product Creation Flow

1. **Admin clicks "Add Product"**
2. **Fills form**:
   - Name, price, category
   - Image URLs
   - Optional: videos, 3D model
   - Stock information
3. **Form submitted** → API route `/api/admin/products`
4. **AI Description Generated**:
   - Calls OpenAI API
   - Gets premium description + tags
5. **Product Created**:
   - Saved to database
   - Images/videos linked
   - Stock status calculated
6. **Product Appears**:
   - In product listing
   - Available for customers
   - AR-ready if 3D model provided

### AR Try-On Flow

1. **User clicks "Try Live on Yourself"**
2. **Camera Permission** requested
3. **MediaPipe Initialized**:
   - Loads appropriate detector (face/hands/pose)
   - Based on product category
4. **Three.js Scene Created**:
   - Loads 3D model (custom or template)
   - Sets up lighting and camera
5. **Real-Time Loop**:
   - Captures video frame
   - Detects landmarks
   - Calculates 3D position
   - Renders jewellery model
   - Updates 60 times per second
6. **User Sees**:
   - Live camera feed
   - 3D jewellery overlaid
   - Tracking their movement

### Search Flow

1. **User types in search box**
2. **After 2 characters**:
   - Filters products client-side
   - Matches name, category, price
   - Shows top 5 results
3. **Suggestions Display**:
   - Product image
   - Product name
   - Category badge
   - Price
4. **User clicks suggestion**:
   - Navigates to product page
5. **Or presses Enter**:
   - Shows all matching products
   - Updates URL with search parameter

---

## 🐛 Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
# Clean install
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force
npm install
```

### Issue: Database errors

**Solution:**
```bash
# Reset database
Remove-Item -Path "prisma\dev.db" -Force
npm run db:generate
npm run db:push
npm run db:seed
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use different port
$env:PORT=3001; npm run dev
```

### Issue: Camera not working (AR)

**Causes:**
- Not HTTPS (camera requires secure context)
- Browser doesn't support WebRTC
- Permissions denied

**Solutions:**
- Use HTTPS in production
- Try different browser (Chrome/Safari recommended)
- Check browser permissions

### Issue: AI descriptions not generating

**Causes:**
- Invalid API key
- No API credits
- Network error

**Solutions:**
- Verify API key in `.env`
- Check OpenAI account credits
- App will use fallback descriptions

### Issue: AR models not appearing

**Causes:**
- Landmarks not detected
- Model URL invalid
- Browser compatibility

**Solutions:**
- Ensure good lighting
- Position yourself correctly
- Check browser console for errors
- Verify 3D model URL is accessible

### Issue: WhatsApp link not working

**Causes:**
- Invalid phone number format
- WhatsApp not installed

**Solutions:**
- Verify number format (country code + number)
- Ensure WhatsApp installed on device
- Test on mobile device

---

## 📊 Performance Optimization

### Already Implemented

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Lazy Loading**: AR components load on demand
- **Caching**: React Query for API responses
- **PWA**: Service workers for offline support

### Production Recommendations

1. **CDN for Images**: Use Cloudinary, Imgix, or similar
2. **Database**: Switch to PostgreSQL for production
3. **Caching**: Add Redis for API responses
4. **Monitoring**: Add error tracking (Sentry)
5. **Analytics**: Add Google Analytics or similar

---

## 🔒 Security Considerations

### Current Implementation

- Admin password in environment variable
- SQL injection protection (Prisma)
- Input validation (Zod)
- XSS protection (React)

### Production Recommendations

1. **Authentication**: Implement JWT or OAuth
2. **Rate Limiting**: Add to API routes
3. **HTTPS**: Required for camera/AR
4. **CORS**: Configure properly
5. **API Keys**: Store securely (not in client code)

---

## 📱 Mobile Optimization

### PWA Features

- **Installable**: Can be added to home screen
- **Offline**: Service workers cache content
- **Fast**: Optimized loading
- **Responsive**: Mobile-first design

### AR Requirements

- **Modern Browser**: Chrome/Safari recommended
- **Camera Access**: Required
- **HTTPS**: Required in production
- **WebGL**: Required for 3D rendering

---

## 🎓 Learning Resources

### Next.js
- Official Docs: https://nextjs.org/docs
- Learn Course: https://nextjs.org/learn

### Prisma
- Official Docs: https://www.prisma.io/docs
- Prisma Studio: `npx prisma studio`

### Three.js
- Official Docs: https://threejs.org/docs
- Examples: https://threejs.org/examples

### MediaPipe
- Official Docs: https://developers.google.com/mediapipe
- Solutions: https://developers.google.com/mediapipe/solutions

### OpenAI
- API Docs: https://platform.openai.com/docs
- Pricing: https://openai.com/pricing

---

## 📞 Support & Help

### Common Questions

**Q: How do I add more products?**
A: Login to admin panel → Click "Add Product" → Fill form → Save

**Q: How do I change the brand name?**
A: Search for "Jaipuri Jewels" in codebase and replace

**Q: Can I use my own 3D models?**
A: Yes! Add GLB/GLTF URL in product form's "3D Model URL" field

**Q: How do I enable real MediaPipe?**
A: See `lib/mediapipe-real.ts` and `README_AR.md` for implementation guide

**Q: Can I use a different AI service?**
A: Yes! Update `lib/ai.ts` with your preferred AI API

---

## 🎉 You're All Set!

Your luxury jewellery showroom is ready to use. Start by:
1. Running `npm run dev`
2. Visiting http://localhost:3000
3. Exploring the admin panel
4. Testing the AR features
5. Adding your products!

For specific feature documentation, see:
- [README_AR.md](./README_AR.md) - AR/3D features
- [SETUP.md](./SETUP.md) - Quick setup
- [QUICK_START.md](./QUICK_START.md) - Fast start guide

---

**Happy Showcasing! 💎✨**
