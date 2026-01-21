import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";
import ProductsClient from "@/components/ProductsClient";

interface SearchParams {
  category?: string;
  search?: string;
  featured?: string;
}

async function getProducts(searchParams: SearchParams) {
  try {
    const where: any = {};
    
    if (searchParams.category) {
      where.category = { slug: searchParams.category };
    }
    
    if (searchParams.featured === "true") {
      where.featured = true;
    }
    
    if (searchParams.search) {
      // MySQL: 'mode: insensitive' is not supported; default contains is case-insensitive with typical collation
      where.OR = [
        { name: { contains: searchParams.search } },
        { description: { contains: searchParams.search } },
        { aiDescription: { contains: searchParams.search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
          take: 1,
        },
        videos: {
          orderBy: { order: "asc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-luxury-ivory py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-luxury-charcoal">
            Our Collection
          </h1>
          <p className="text-lg text-luxury-charcoal-light max-w-2xl mx-auto">
            Explore our exquisite range of handcrafted luxury jewellery
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ProductsClient initialProducts={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
