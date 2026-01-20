"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Copy, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

interface DeepLink {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string | null;
  order: number;
}

async function fetchDeepLinks(): Promise<DeepLink[]> {
  const res = await fetch("/api/deep-links");
  if (!res.ok) throw new Error("Failed to fetch deep links");
  return res.json();
}

export default function BioLinksPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { data: links = [], isLoading } = useQuery({
    queryKey: ["deep-links"],
    queryFn: fetchDeepLinks,
  });

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-ivory py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-luxury-gold-light/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            <span className="text-sm font-medium text-luxury-charcoal">
              Instagram Bio Links
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-luxury-charcoal">
            Bio-Ready Deep Links
          </h1>
          <p className="text-lg text-luxury-charcoal-light max-w-2xl mx-auto">
            Copy these links to use in your Instagram bio or anywhere you need direct category links
          </p>
        </div>

        {links.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center luxury-shadow">
            <p className="text-luxury-charcoal-light mb-4">
              No deep links configured yet.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-luxury-gold hover:underline"
            >
              Go to Admin Panel
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link) => {
              // For featured, use featured=true parameter, otherwise use category slug
              const categorySlug = link.slug === "featured" ? null : link.slug;
              const url = `${appUrl}/products${link.slug === "featured" ? "?featured=true" : categorySlug ? `?category=${categorySlug}` : ""}`;
              return (
                <div
                  key={link.id}
                  className="bg-white rounded-2xl p-6 luxury-shadow hover:luxury-shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-luxury-charcoal mb-2">
                        {link.name}
                      </h3>
                      {link.description && (
                        <p className="text-luxury-charcoal-light mb-2">
                          {link.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-luxury-charcoal-light">
                        <code className="bg-luxury-ivory-dark px-2 py-1 rounded text-xs font-mono break-all">
                          {url}
                        </code>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(url, link.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold-dark transition-colors"
                      >
                        {copiedId === link.id ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-luxury-ivory-darker rounded-lg hover:bg-luxury-ivory-dark transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-12 bg-white rounded-2xl p-6 luxury-shadow">
          <h2 className="text-xl font-bold mb-4 text-luxury-charcoal">
            Quick Category Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "All Products", slug: null },
              { name: "Rings", slug: "rings" },
              { name: "Necklaces", slug: "necklaces" },
              { name: "Earrings", slug: "earrings" },
              { name: "Bracelets", slug: "bracelets" },
              { name: "Anklets", slug: "anklets" },
              { name: "Tiaras", slug: "tiaras" },
              { name: "Crowns", slug: "crowns" },
              { name: "Pendants", slug: "pendants" },
              { name: "Brooches", slug: "brooches" },
              { name: "Hair Accessories", slug: "hair-accessories" },
              { name: "Featured", slug: "featured", param: "featured=true" },
            ].map((category) => {
              const url = `${appUrl}/products${category.param || (category.slug ? `?category=${category.slug}` : "")}`;
              return (
                <div key={category.name || "all"} className="text-center">
                  <button
                    onClick={() => copyToClipboard(url, category.name || "all")}
                    className="w-full p-3 bg-luxury-ivory-dark rounded-lg hover:bg-luxury-gold-light transition-colors text-sm font-medium text-luxury-charcoal"
                  >
                    {category.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
