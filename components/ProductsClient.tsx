"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductGrid from "./ProductGrid";
import ProductFilters, { FilterState } from "./ProductFilters";
import SearchSuggestions from "./SearchSuggestions";
import { Search, Filter, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stockStatus: string;
  images: Array<{ url: string; alt: string | null }>;
  videos?: Array<{ url: string }>;
  category: { name: string; slug: string };
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsClient({
  initialProducts,
  categories,
}: ProductsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    size: [],
    jewelryType: [],
    stones: [],
  });
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);

  const currentCategory = searchParams.get("category");
  const currentSearch = searchParams.get("search");

  // Real-time search suggestions
  const searchSuggestions = useMemo(() => {
    if (!search.trim() || search.length < 2) return [];
    
    const query = search.toLowerCase();
    return initialProducts
      .filter((product) => {
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.name.toLowerCase().includes(query);
        const matchesPrice = product.price.toString().includes(query);
        return matchesName || matchesCategory || matchesPrice;
      })
      .slice(0, 5); // Limit to 5 suggestions
  }, [search, initialProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (currentCategory) params.set("category", currentCategory);
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionSelect = (product: Product) => {
    setSearch(product.name);
    setShowSuggestions(false);
    router.push(`/products/${product.slug}`);
  };

  const handleCategoryChange = (categorySlug: string | null) => {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (currentSearch) params.set("search", currentSearch);
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
    setSearch("");
    setFilters({
      priceRange: [0, 1000000],
      size: [],
      jewelryType: [],
      stones: [],
    });
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...initialProducts];

    // Search filter
    if (currentSearch) {
      const query = currentSearch.toLowerCase();
      filtered = filtered.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCategory = p.category.name.toLowerCase().includes(query);
        const matchesPrice = p.price.toString().includes(query);
        return matchesName || matchesCategory || matchesPrice;
      });
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Category filter
    if (currentCategory) {
      filtered = filtered.filter((p) => p.category.slug === currentCategory);
    }

    // Note: Size, jewelry type, and stones would need to be stored in product metadata
    // For now, we'll filter by name/description matching
    if (filters.stones.length > 0) {
      filtered = filtered.filter((p) =>
        filters.stones.some((stone) =>
          p.name.toLowerCase().includes(stone.toLowerCase()) ||
          p.category.name.toLowerCase().includes(stone.toLowerCase())
        )
      );
    }

    setFilteredProducts(filtered);
  }, [filters, initialProducts, currentSearch, currentCategory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <ProductFilters onFilterChange={setFilters} />
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white rounded-2xl p-6 luxury-shadow">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-luxury-charcoal-light w-5 h-5 z-10" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (search.length >= 2) setShowSuggestions(true);
              }}
              onBlur={() => {
                // Delay to allow click on suggestions
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder="Search products, categories, prices..."
              className="w-full pl-12 pr-4 py-3 border border-luxury-ivory-darker rounded-full focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
            />
            {showSuggestions && searchSuggestions.length > 0 && (
              <SearchSuggestions
                products={searchSuggestions}
                searchQuery={search}
                onClose={() => setShowSuggestions(false)}
                onSelect={handleSuggestionSelect}
              />
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-luxury-charcoal text-luxury-ivory rounded-full font-medium hover:bg-luxury-charcoal-light transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-3 border border-luxury-ivory-darker rounded-full hover:bg-luxury-ivory-dark transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </form>

        {/* Category Filters */}
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } md:block border-t border-luxury-ivory-darker pt-4`}
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-luxury-charcoal mr-2">
              Categories:
            </span>
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !currentCategory
                  ? "bg-luxury-gold text-white"
                  : "bg-luxury-ivory-dark text-luxury-charcoal hover:bg-luxury-gold-light"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentCategory === category.slug
                    ? "bg-luxury-gold text-white"
                    : "bg-luxury-ivory-dark text-luxury-charcoal hover:bg-luxury-gold-light"
                }`}
              >
                {category.name}
              </button>
            ))}
            {(currentCategory || currentSearch) && (
              <button
                onClick={clearFilters}
                className="ml-auto px-4 py-2 rounded-full text-sm font-medium bg-luxury-ivory-dark text-luxury-charcoal hover:bg-red-100 hover:text-red-800 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <ProductGrid 
              products={filteredProducts.map((p) => ({
                ...p,
                stockStatus: p.stockStatus as "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK",
              }))} 
            />
            <div className="mt-8 text-center text-luxury-charcoal-light">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-luxury-charcoal-light mb-4">
              No products found.
            </p>
            {(currentCategory || currentSearch || filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000 || filters.stones.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-luxury-gold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
