/**
 * Export all data from SQLite database to JSON
 * This file can be used to backup data and import to PostgreSQL on Vercel
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function exportData() {
  console.log("📤 Exporting database data...");

  try {
    // Export Categories
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
    });
    console.log(`✅ Exported ${categories.length} categories`);

    // Export Products with relations
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        videos: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(`✅ Exported ${products.length} products`);

    // Export Deep Links
    const deepLinks = await prisma.deepLink.findMany({
      orderBy: { order: "asc" },
    });
    console.log(`✅ Exported ${deepLinks.length} deep links`);

    // Prepare export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      categories,
      products: products.map((product) => ({
        name: product.name,
        slug: product.slug,
        price: product.price,
        description: product.description,
        aiDescription: product.aiDescription,
        tags: product.tags,
        categorySlug: product.category.slug, // Use slug instead of ID for portability
        stockCount: product.stockCount,
        lowStockThreshold: product.lowStockThreshold,
        featured: product.featured,
        threeDModel: product.threeDModel,
        metadata: product.metadata,
        images: product.images.map((img) => ({
          url: img.url,
          alt: img.alt,
          order: img.order,
          is360: img.is360,
        })),
        videos: product.videos.map((vid) => ({
          url: vid.url,
          thumbnail: vid.thumbnail,
          order: vid.order,
        })),
      })),
      deepLinks: deepLinks.map((link) => ({
        name: link.name,
        slug: link.slug,
        categorySlug: link.categoryId
          ? categories.find((c) => c.id === link.categoryId)?.slug
          : null,
        description: link.description,
        order: link.order,
        isActive: link.isActive,
      })),
    };

    // Save to file
    const exportPath = path.join(process.cwd(), "data-export.json");
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));

    console.log(`\n✅ Data exported successfully to: ${exportPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Deep Links: ${deepLinks.length}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Review data-export.json`);
    console.log(`   2. Set up PostgreSQL on Vercel`);
    console.log(`   3. Run: npm run db:import`);
  } catch (error) {
    console.error("❌ Error exporting data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
