import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateProductDescription } from "@/lib/ai";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  categoryId: z.string(),
  images: z.array(z.string()).min(1),
  videos: z.array(z.string()).optional(),
  stockCount: z.number().int().min(0).optional().default(0),
  lowStockThreshold: z.number().int().min(0).optional().default(5),
  featured: z.boolean().optional().default(false),
  threeDModel: z.string().optional(),
  metadata: z.string().optional(),
});

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function calculateStockStatus(
  stockCount: number,
  lowStockThreshold: number
): "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" {
  if (stockCount === 0) return "OUT_OF_STOCK";
  if (stockCount <= lowStockThreshold) return "LOW_STOCK";
  return "AVAILABLE";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Get category to use in AI description
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Generate AI description
    const { description, tags } = await generateProductDescription(
      validatedData.name,
      category.name,
      validatedData.price
    );

    const slug = slugify(validatedData.name);
    const stockStatus = calculateStockStatus(
      validatedData.stockCount || 0,
      validatedData.lowStockThreshold || 5
    );

    // Create product with images and videos
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug,
        price: validatedData.price,
        categoryId: validatedData.categoryId,
        aiDescription: description,
        tags: JSON.stringify(tags),
        stockCount: validatedData.stockCount || 0,
        lowStockThreshold: validatedData.lowStockThreshold || 5,
        stockStatus,
        featured: validatedData.featured || false,
        threeDModel: validatedData.threeDModel || null,
        metadata: validatedData.metadata || null,
        images: {
          create: validatedData.images.map((url, index) => ({
            url,
            alt: `${validatedData.name} - Image ${index + 1}`,
            order: index,
          })),
        },
        videos: validatedData.videos
          ? {
              create: validatedData.videos.map((url, index) => ({
                url,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        videos: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        videos: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
