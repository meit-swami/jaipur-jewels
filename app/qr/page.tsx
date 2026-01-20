import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles, Crown } from "lucide-react";

export default function QRLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-ivory to-luxury-ivory-dark flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Welcome Animation */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-luxury-gold-light/20 rounded-full mb-6">
            <Crown className="w-10 h-10 text-luxury-gold" />
          </div>
          <div className="inline-flex items-center gap-2 bg-luxury-gold-light/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-luxury-gold" />
            <span className="text-sm font-medium text-luxury-charcoal">
              Welcome to Jaipuri Jewels
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-luxury-charcoal animate-slide-up">
          Discover Our
          <br />
          <span className="text-luxury-gold">Exquisite Collection</span>
        </h1>

        <p className="text-xl md:text-2xl text-luxury-charcoal-light mb-12 max-w-xl mx-auto animate-slide-up-delay">
          Handcrafted pieces that define elegance and sophistication. 
          Explore timeless designs that celebrate luxury.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-luxury-charcoal text-luxury-ivory px-8 py-4 rounded-full font-medium hover:bg-luxury-charcoal-light transition-colors luxury-shadow text-lg"
          >
            Browse Collection
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-luxury-charcoal px-8 py-4 rounded-full font-medium hover:bg-luxury-ivory-dark transition-colors luxury-shadow text-lg"
          >
            Learn More
          </Link>
        </div>

        {/* Quick Access Categories */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in-delay-2">
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
              className="group bg-white rounded-2xl p-6 hover:luxury-shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.emoji}
              </div>
              <div className="text-sm font-semibold text-luxury-charcoal group-hover:text-luxury-gold transition-colors">
                {category.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
