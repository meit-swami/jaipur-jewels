import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";

type StockStatus = "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK";

interface ProductForGrid {
  id: string;
  name: string;
  slug: string;
  price: number;
  stockStatus: StockStatus;
  images: Array<{ url: string; alt: string | null }>;
  videos?: Array<{ url: string }>;
  category: { name: string; slug: string };
}

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
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
      take: 6,
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-luxury-ivory to-luxury-ivory-dark overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232C2C2C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-luxury-gold-light/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            <span className="text-sm font-medium text-luxury-charcoal">Jaipuri Jewels Collections</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-luxury-charcoal">
            Timeless Elegance,
            <br />
            <span className="text-luxury-gold">Handcrafted Excellence</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-luxury-charcoal-light mb-8 max-w-2xl mx-auto">
            Discover our exquisite collection of luxury jewellery, where every piece tells a story of craftsmanship and sophistication.
          </p>
          
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-luxury-charcoal text-luxury-ivory px-8 py-4 rounded-full font-medium hover:bg-luxury-charcoal-light transition-colors luxury-shadow"
          >
            Explore Collection
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-luxury-charcoal/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-luxury-charcoal/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4 bg-luxury-ivory-dark">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-luxury-charcoal">
                Featured Collection
              </h2>
              <p className="text-lg text-luxury-charcoal-light max-w-2xl mx-auto">
                Handpicked pieces that embody our commitment to luxury and excellence
              </p>
            </div>
            
            <ProductGrid 
              products={featuredProducts.map((p): ProductForGrid => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price,
                stockStatus: p.stockStatus as StockStatus,
                images: p.images.map((img) => ({
                  url: img.url,
                  alt: img.alt,
                })),
                videos: p.videos?.map((v) => ({
                  url: v.url,
                })),
                category: {
                  name: p.category.name,
                  slug: p.category.slug,
                },
              }))} 
            />
            
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium text-lg"
              >
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-20 px-4 bg-luxury-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-luxury-charcoal">
              Shop by Category
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { name: "Rings", slug: "rings", emoji: "💍" },
              { name: "Necklaces", slug: "necklaces", emoji: "📿" },
              { name: "Earrings", slug: "earrings", emoji: "👂" },
              { name: "Bracelets", slug: "bracelets", emoji: "✨" },
              { name: "Anklets", slug: "anklets", emoji: "🦶" },
              { name: "Tiaras", slug: "tiaras", emoji: "👑" },
              { name: "Crowns", slug: "crowns", emoji: "👑" },
              { name: "Pendants", slug: "pendants", emoji: "💎" },
              { name: "Brooches", slug: "brooches", emoji: "📌" },
              { name: "Hair Accessories", slug: "hair-accessories", emoji: "🎀" },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group bg-white rounded-2xl p-8 text-center hover:luxury-shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{category.emoji}</div>
                <h3 className="text-xl font-semibold text-luxury-charcoal group-hover:text-luxury-gold transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
