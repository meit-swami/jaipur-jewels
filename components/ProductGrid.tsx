"use client";

import Link from "next/link";
import Image from "next/image";
type StockStatus = "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK";
import { ShoppingBag, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stockStatus: StockStatus;
  images: Array<{ url: string; alt: string | null }>;
  videos?: Array<{ url: string }>;
  category: { name: string; slug: string };
}

interface ProductGridProps {
  products: Product[];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getStockBadge(status: StockStatus) {
  switch (status) {
    case "OUT_OF_STOCK":
      return (
        <span className="absolute top-3 right-3 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Out of Stock
        </span>
      );
    case "LOW_STOCK":
      return (
        <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Low Stock
        </span>
      );
    default:
      return null;
  }
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-luxury-charcoal-light">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group bg-white rounded-2xl overflow-hidden hover:luxury-shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative aspect-square bg-luxury-ivory-dark overflow-hidden">
            {product.images[0] && (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
            
            {/* Auto-play video on hover */}
            {product.videos && product.videos[0] && (
              <video
                src={product.videos[0].url}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                autoPlay
                loop
                muted
                playsInline
                onMouseEnter={(e) => {
                  const video = e.currentTarget;
                  video.play().catch(() => {});
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget;
                  video.pause();
                  video.currentTime = 0;
                }}
              />
            )}
            
            {!product.images[0] && (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-luxury-gold-light opacity-20" />
              </div>
            )}
            
            {getStockBadge(product.stockStatus as StockStatus)}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="p-6">
            <div className="text-sm text-luxury-gold mb-2 uppercase tracking-wide">
              {product.category.name}
            </div>
            <h3 className="text-xl font-bold text-luxury-charcoal mb-2 group-hover:text-luxury-gold transition-colors">
              {product.name}
            </h3>
            <div className="text-2xl font-bold text-luxury-charcoal">
              {formatPrice(product.price)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
