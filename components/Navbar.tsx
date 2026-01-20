"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Crown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-luxury-ivory-darker/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <Crown className="w-6 h-6 md:w-8 md:h-8 text-luxury-gold group-hover:scale-110 transition-transform" />
            <span className="text-xl md:text-2xl font-bold text-luxury-charcoal">
              Jaipuri Jewels
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              href="/links"
              className="text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium"
            >
              Bio Links
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-luxury-charcoal"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-luxury-ivory-darker/20">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              href="/"
              className="block py-2 text-luxury-charcoal hover:text-luxury-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block py-2 text-luxury-charcoal hover:text-luxury-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/links"
              className="block py-2 text-luxury-charcoal hover:text-luxury-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Bio Links
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
