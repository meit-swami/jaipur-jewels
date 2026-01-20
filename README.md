# Jaipuri Jewels - Luxury Jewellery Showroom

A modern, luxury jewellery showroom web application built with cutting-edge web technologies, featuring AI-powered product descriptions, real-time AR/3D try-on experiences, and a comprehensive admin panel.

## 🌟 Overview

Jaipuri Jewels is a production-ready, mobile-first PWA that showcases luxury jewellery collections with advanced features including:
- **AI-Generated Product Descriptions** using OpenAI GPT-4
- **AR/3D Try-On Experience** with MediaPipe and Three.js
- **Real-time Stock Management** with automated status updates
- **Instagram Bio-Ready Deep Links** for social media marketing
- **QR Code Integration** for seamless mobile access
- **Advanced Filtering System** with price, size, jewelry type, and stone filters
- **360° Product Views** with interactive Three.js rendering

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **OpenAI API Key** (optional, for AI descriptions)
- **Modern browser** with WebGL support (for AR features)

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd "D:\Meit Personal Project\Jewelery"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   OPENAI_API_KEY="your-openai-api-key-here"
   NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
   NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
   ```

4. **Initialize the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Seed the database with sample products**
   ```bash
   npm run db:seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Complete Documentation

For detailed instructions, see:
- **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** - Complete setup and usage guide (includes all commands, admin access, database info)
- **[README_AR.md](./README_AR.md)** - AR/3D try-on feature documentation

## 🎯 Key Features

### Customer-Facing Features

- **Product Showcase**
  - Beautiful product listing with ecommerce-style UI
  - Individual product detail pages with images, videos, and AI descriptions
  - 360° product view with interactive Three.js rendering
  - Video auto-play on image hover
  - Real-time search with suggestions

- **AR/3D Try-On**
  - "Try Live on Yourself" button on every product
  - Real-time AR experience using MediaPipe landmark detection
  - Category-based placement (rings, necklaces, earrings, etc.)
  - QR code generation for sharing AR experiences
  - Works on modern mobile browsers (no app install)

- **Advanced Filtering**
  - Price range slider (₹0 - ₹10,00,000)
  - Size filters (Small, Medium, Large, Extra Large)
  - Jewelry type filters (Gold, Silver, Platinum, etc.)
  - Stone filters (Diamond, Pearl, Ruby, etc.)
  - Category-based filtering

- **WhatsApp Integration**
  - Direct WhatsApp contact with product details
  - Pre-filled messages with product name, ID, and price
  - User details collection (name, phone, email, query)
  - Mobile-optimized for QR code scanning

- **Social Media Integration**
  - Instagram bio-ready deep links (5-7 category-based links)
  - QR code optimized landing page
  - Shareable product links

### Admin Features

- **Product Management**
  - Add/edit/delete products
  - Upload product images and videos
  - Set prices in INR (₹)
  - Manage stock counts and thresholds
  - Featured product toggle
  - 3D model URL mapping for AR

- **AI-Powered Descriptions**
  - Automatic premium description generation
  - Tag generation for SEO
  - Uses OpenAI GPT-4 (with fallback descriptions)

- **Stock Management**
  - Real-time stock status (Available, Low Stock, Out of Stock)
  - Automated status calculation
  - Visual status indicators
  - Stock count and threshold management

- **Secure Admin Panel**
  - Password-protected access
  - No admin link in public navigation
  - Login page at `/admin/login`

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **React Three Fiber** - 3D graphics rendering
- **Three.js** - 3D library for WebGL
- **Framer Motion** - Smooth animations
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management (ready for use)

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database toolkit
- **SQLite** - Lightweight database (easily switchable to PostgreSQL/MySQL)

### AI & Machine Learning
- **OpenAI GPT-4** - Product description generation
- **MediaPipe** - Real-time landmark detection for AR
  - Face Mesh (468 landmarks)
  - Hands (21 landmarks per hand)
  - Pose (33 landmarks)

### 3D & AR
- **Three.js** - 3D rendering engine
- **WebXR** - AR/VR web standard
- **GLTF/GLB Loader** - 3D model format support
- **MediaPipe Solutions** - Computer vision for AR

### PWA & Mobile
- **next-pwa** - Progressive Web App support
- **Service Workers** - Offline capability
- **Web App Manifest** - Installable app

### Utilities
- **Zod** - Schema validation
- **React Hook Form** - Form handling
- **Lucide React** - Icon library
- **qrcode.react** - QR code generation

## 📁 Project Structure

```
Jewelery/
├── app/                          # Next.js App Router
│   ├── admin/                   # Admin panel
│   │   └── login/               # Admin login page
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin operations
│   │   ├── products/            # Product endpoints
│   │   ├── categories/          # Category endpoints
│   │   └── deep-links/          # Deep link management
│   ├── links/                   # Instagram bio links page
│   ├── products/                # Product listing and detail
│   ├── qr/                      # QR landing page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── sitemap.ts               # Dynamic sitemap
│   └── robots.ts                # Robots.txt
│
├── components/                   # React components
│   ├── AdminProductForm.tsx     # Product creation/edit form
│   ├── StockManagementModal.tsx # Stock management UI
│   ├── ProductGrid.tsx          # Product grid display
│   ├── ProductsClient.tsx       # Client-side product listing
│   ├── ProductFilters.tsx       # Advanced filters
│   ├── SearchSuggestions.tsx    # Real-time search suggestions
│   ├── ProductView360.tsx       # 360° product viewer
│   ├── ARTryOnButton.tsx        # AR entry button
│   ├── ARTryOnViewer.tsx        # Full-screen AR experience
│   ├── ARAutoOpen.tsx           # Auto-open AR from QR
│   ├── QRCodeDisplay.tsx        # QR code generation
│   ├── WhatsAppContact.tsx      # WhatsApp contact form
│   ├── Navbar.tsx               # Navigation bar
│   └── Footer.tsx               # Footer component
│
├── lib/                         # Utility libraries
│   ├── prisma.ts                # Prisma client singleton
│   ├── ai.ts                    # OpenAI integration
│   ├── ar-manager.ts            # AR logic & 3D rendering
│   ├── mediapipe-detector.ts    # Landmark detection wrapper
│   └── mediapipe-real.ts        # Production MediaPipe guide
│
├── prisma/                      # Database
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed script with sample data
│
└── public/                      # Static assets
    └── manifest.json            # PWA manifest
```

## 🎨 Design System

### Colors
- **Primary Background**: `#FAF8F3` (Luxury Ivory)
- **Secondary Background**: `#F5F1E8` (Ivory Dark)
- **Accent**: `#D4AF37` (Luxury Gold)
- **Text**: `#2C2C2C` (Charcoal)
- **Text Light**: `#4A4A4A` (Charcoal Light)

### Typography
- **Headings**: Playfair Display (serif) - Elegant, luxury feel
- **Body**: Inter (sans-serif) - Clean, modern readability

## 🔐 Security & Authentication

### Admin Panel Access
- **URL**: `/admin/login`
- **Default Password**: `admin123`
- **Custom Password**: Set `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env`
- **Session**: Uses sessionStorage (client-side)
- **Note**: For production, implement proper authentication (JWT, OAuth, etc.)

## 📊 Database

### Technology
- **Database**: SQLite (development)
- **ORM**: Prisma
- **Location**: `prisma/dev.db`
- **Schema**: Defined in `prisma/schema.prisma`

### Models
- **Category** - Product categories (Rings, Necklaces, etc.)
- **Product** - Jewellery products with full details
- **ProductImage** - Product images with ordering
- **ProductVideo** - Product videos
- **DeepLink** - Instagram bio links

### Importing Data
See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for detailed database import instructions.

## 🤖 AI Integration

### OpenAI GPT-4
- **Purpose**: Generate premium product descriptions
- **API**: OpenAI GPT-4o-mini
- **Fallback**: Custom descriptions if API unavailable
- **Usage**: Automatic on product creation
- **Configuration**: Set `OPENAI_API_KEY` in `.env`

### AI Features
- Premium, luxury-focused descriptions
- Automatic tag generation
- SEO-optimized content
- Category-aware descriptions

## 🎯 Unique Features

1. **AI-Powered Descriptions**
   - Automatic generation using GPT-4
   - Luxury-focused, premium language
   - Category-aware content

2. **AR/3D Try-On**
   - Real-time landmark detection
   - Category-based placement
   - No app installation required
   - Works on mobile browsers

3. **360° Product Views**
   - Interactive Three.js rendering
   - Drag to rotate, scroll to zoom
   - Smooth animations

4. **Real-time Search**
   - Instant suggestions as you type
   - Product previews with images
   - Searches name, category, price

5. **Advanced Filtering**
   - Dual-range price slider
   - Multi-select filters
   - Real-time filtering

6. **WhatsApp Integration**
   - Direct contact with product details
   - Pre-filled messages
   - Mobile-optimized

7. **QR Code System**
   - Product-specific QR codes
   - Direct AR access
   - Shareable links

## 📱 Pages & Routes

- **Homepage** (`/`) - Hero section with featured products
- **Products** (`/products`) - Product listing with filters
- **Product Detail** (`/products/[slug]`) - Individual product with AR
- **Admin Panel** (`/admin`) - Product management (login required)
- **Admin Login** (`/admin/login`) - Admin authentication
- **Bio Links** (`/links`) - Instagram-ready deep links
- **QR Landing** (`/qr`) - Optimized landing page

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Recommended Platforms
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Render**

### Production Checklist
- [ ] Update `DATABASE_URL` to production database
- [ ] Set all environment variables
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Configure proper authentication
- [ ] Set up HTTPS (required for camera/AR)
- [ ] Enable PWA features
- [ ] Configure CDN for images/videos

## 📝 Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Integration
OPENAI_API_KEY="your-openai-api-key-here"

# WhatsApp Integration
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"

# Admin Security
NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
```

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db
npm run db:generate
npm run db:push
npm run db:seed
```

### Port Already in Use
```bash
PORT=3001 npm run dev
```

### AR Not Working
- Ensure HTTPS in production (camera requires secure context)
- Check browser compatibility
- Verify camera permissions

### AI Descriptions Not Generating
- Check OpenAI API key in `.env`
- Verify API credits available
- App will use fallback descriptions

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [MediaPipe Documentation](https://developers.google.com/mediapipe)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 📄 License

This project is private and proprietary.

## 👥 Support

For issues or questions, refer to [INSTRUCTIONS.md](./INSTRUCTIONS.md) or contact the development team.

---

**Built with ❤️ for Jaipuri Jewels**
