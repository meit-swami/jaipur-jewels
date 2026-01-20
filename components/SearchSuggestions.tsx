"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: Array<{ url: string; alt: string | null }>;
  category: { name: string; slug: string };
}

interface SearchSuggestionsProps {
  products: Product[];
  searchQuery: string;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function SearchSuggestions({
  products,
  searchQuery,
  onClose,
  onSelect,
}: SearchSuggestionsProps) {
  if (products.length === 0 || !searchQuery.trim()) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-luxury-ivory-darker z-50 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-luxury-ivory-darker flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-luxury-gold" />
          <span className="text-sm font-medium text-luxury-charcoal">
            {products.length} result{products.length !== 1 ? "s" : ""} found
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-luxury-ivory-dark rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-luxury-charcoal-light" />
        </button>
      </div>
      
      <div className="divide-y divide-luxury-ivory-darker">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            onClick={() => onSelect(product)}
            className="flex items-center gap-4 p-4 hover:bg-luxury-ivory transition-colors group"
          >
            <div className="relative w-16 h-16 bg-luxury-ivory-dark rounded-lg overflow-hidden flex-shrink-0">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-luxury-gold-light opacity-30" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-luxury-charcoal group-hover:text-luxury-gold transition-colors truncate">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-luxury-gold bg-luxury-gold-light/20 px-2 py-0.5 rounded-full">
                  {product.category.name}
                </span>
                <span className="text-sm font-bold text-luxury-charcoal">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
