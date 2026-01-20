import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-ivory flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-luxury-gold mb-4">404</h1>
        <h2 className="text-3xl font-bold text-luxury-charcoal mb-4">
          Page Not Found
        </h2>
        <p className="text-luxury-charcoal-light mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-luxury-charcoal text-luxury-ivory px-6 py-3 rounded-full font-medium hover:bg-luxury-charcoal-light transition-colors luxury-shadow"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-luxury-charcoal px-6 py-3 rounded-full font-medium hover:bg-luxury-ivory-dark transition-colors luxury-shadow border border-luxury-ivory-darker"
          >
            <ArrowLeft className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
