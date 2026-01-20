import Link from "next/link";
import { Crown } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-luxury-charcoal text-luxury-ivory mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-luxury-gold" />
              <span className="text-xl font-bold">Jaipuri Jewels</span>
            </Link>
            <p className="text-luxury-ivory-dark text-sm">
              Handcrafted elegance for the discerning collector.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-luxury-ivory-dark">
              <li>
                <Link href="/products" className="hover:text-luxury-gold transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=rings" className="hover:text-luxury-gold transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/products?category=necklaces" className="hover:text-luxury-gold transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/products?category=earrings" className="hover:text-luxury-gold transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/products?category=anklets" className="hover:text-luxury-gold transition-colors">
                  Anklets
                </Link>
              </li>
              <li>
                <Link href="/products?category=tiaras" className="hover:text-luxury-gold transition-colors">
                  Tiaras
                </Link>
              </li>
              <li>
                <Link href="/products?category=crowns" className="hover:text-luxury-gold transition-colors">
                  Crowns
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-luxury-ivory-dark">
              <li>
                <Link href="/admin" className="hover:text-luxury-gold transition-colors">
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link href="/links" className="hover:text-luxury-gold transition-colors">
                  Bio Links
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <p className="text-sm text-luxury-ivory-dark mb-4">
              Follow us for the latest collections and exclusive pieces.
            </p>
          </div>
        </div>
        
        <div className="border-t border-luxury-charcoal-light mt-8 pt-8 text-center text-sm text-luxury-ivory-dark">
          <p>&copy; {new Date().getFullYear()} Jaipuri Jewels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
