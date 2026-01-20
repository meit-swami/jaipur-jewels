/**
 * Import data from JSON export file to database
 * Works with both SQLite (local) and PostgreSQL (Vercel)
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function importData() {
  console.log("📥 Importing database data...");

  try {
    // Read export file
    const exportPath = path.join(process.cwd(), "data-export.json");
    
    if (!fs.existsSync(exportPath)) {
      throw new Error(
        `Export file not found: ${exportPath}\n` +
        `Please run: npm run db:export first`
      );
    }

    const exportData = JSON.parse(fs.readFileSync(exportPath, "utf-8"));
    console.log(`📅 Export date: ${exportData.exportedAt}`);

    // Import Categories
    console.log("\n📁 Importing categories...");
    const categoryMap = new Map<string, string>(); // slug -> id

    for (const categoryData of exportData.categories) {
      const category = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: {
          name: categoryData.name,
          description: categoryData.description,
          image: categoryData.image,
          order: categoryData.order,
        },
        create: {
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          image: categoryData.image,
          order: categoryData.order,
        },
      });
      categoryMap.set(category.slug, category.id);
      console.log(`   ✅ ${category.name}`);
    }

    // Import Products
    console.log("\n📦 Importing products...");
    for (const productData of exportData.products) {
      const categoryId = categoryMap.get(productData.categorySlug);
      
      if (!categoryId) {
        console.warn(`   ⚠️  Skipping product "${productData.name}" - category not found`);
        continue;
      }

      // Calculate stock status
      const stockStatus =
        productData.stockCount === 0
          ? "OUT_OF_STOCK"
          : productData.stockCount <= productData.lowStockThreshold
          ? "LOW_STOCK"
          : "AVAILABLE";

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { slug: productData.slug },
      });

      if (existingProduct) {
        // Update existing product
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            name: productData.name,
            price: productData.price,
            description: productData.description,
            aiDescription: productData.aiDescription,
            tags: productData.tags,
            categoryId,
            stockCount: productData.stockCount,
            lowStockThreshold: productData.lowStockThreshold,
            stockStatus,
            featured: productData.featured,
            threeDModel: productData.threeDModel,
            metadata: productData.metadata,
          },
        });

        // Update images
        await prisma.productImage.deleteMany({
          where: { productId: existingProduct.id },
        });
        await prisma.productImage.createMany({
          data: productData.images.map((img: any) => ({
            productId: existingProduct.id,
            url: img.url,
            alt: img.alt,
            order: img.order,
            is360: img.is360,
          })),
        });

        // Update videos
        await prisma.productVideo.deleteMany({
          where: { productId: existingProduct.id },
        });
        if (productData.videos && productData.videos.length > 0) {
          await prisma.productVideo.createMany({
            data: productData.videos.map((vid: any) => ({
              productId: existingProduct.id,
              url: vid.url,
              thumbnail: vid.thumbnail,
              order: vid.order,
            })),
          });
        }

        console.log(`   ✅ Updated: ${productData.name}`);
      } else {
        // Create new product
        await prisma.product.create({
          data: {
            name: productData.name,
            slug: productData.slug,
            price: productData.price,
            description: productData.description,
            aiDescription: productData.aiDescription,
            tags: productData.tags,
            categoryId,
            stockCount: productData.stockCount,
            lowStockThreshold: productData.lowStockThreshold,
            stockStatus,
            featured: productData.featured,
            threeDModel: productData.threeDModel,
            metadata: productData.metadata,
            images: {
              create: productData.images.map((img: any) => ({
                url: img.url,
                alt: img.alt,
                order: img.order,
                is360: img.is360,
              })),
            },
            videos:
              productData.videos && productData.videos.length > 0
                ? {
                    create: productData.videos.map((vid: any) => ({
                      url: vid.url,
                      thumbnail: vid.thumbnail,
                      order: vid.order,
                    })),
                  }
                : undefined,
          },
        });
        console.log(`   ✅ Created: ${productData.name}`);
      }
    }

    // Import Deep Links
    console.log("\n🔗 Importing deep links...");
    for (const linkData of exportData.deepLinks) {
      const categoryId = linkData.categorySlug
        ? categoryMap.get(linkData.categorySlug)
        : null;

      await prisma.deepLink.upsert({
        where: { slug: linkData.slug },
        update: {
          name: linkData.name,
          categoryId,
          description: linkData.description,
          order: linkData.order,
          isActive: linkData.isActive,
        },
        create: {
          name: linkData.name,
          slug: linkData.slug,
          categoryId,
          description: linkData.description,
          order: linkData.order,
          isActive: linkData.isActive,
        },
      });
      console.log(`   ✅ ${linkData.name}`);
    }

    console.log("\n🎉 Data import completed successfully!");
  } catch (error) {
    console.error("❌ Error importing data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
