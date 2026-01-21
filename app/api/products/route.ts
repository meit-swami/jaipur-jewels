import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const where: any = {};
    
    if (category) {
      where.category = { slug: category };
    }
    
    if (featured === "true") {
      where.featured = true;
    }
    
    if (search) {
      // MySQL: 'mode: insensitive' is not supported; default contains is case-insensitive with typical collation
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { aiDescription: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
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

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
