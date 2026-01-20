"use client";

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

interface WhatsAppContactProps {
  productId?: string;
  productName?: string;
  productPrice?: number;
}

export default function WhatsAppContact({
  productId,
  productName,
  productPrice,
}: WhatsAppContactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");

  // WhatsApp number - Update this with your admin's WhatsApp number
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"; // Format: country code + number (no + or spaces)

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppClick = () => {
    if (!name || !phone) {
      alert("Please fill in your name and phone number");
      return;
    }

    // Build the message
    let message = `Hello Jaipuri Jewels!%0A%0A`;
    message += `I'm interested in: *${productName || "a product"}*%0A`;
    
    if (productId) {
      message += `Product ID: ${productId}%0A`;
    }
    
    if (productPrice) {
      message += `Price: ${formatPrice(productPrice)}%0A`;
    }
    
    message += `%0A`;
    message += `*My Details:*%0A`;
    message += `Name: ${name}%0A`;
    message += `Phone: ${phone}%0A`;
    
    if (email) {
      message += `Email: ${email}%0A`;
    }
    
    if (query) {
      message += `%0A*My Query:*%0A${query}`;
    }

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    
    // Reset form
    setName("");
    setPhone("");
    setEmail("");
    setQuery("");
    setIsOpen(false);
  };

  return (
    <>
      {/* WhatsApp Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 luxury-shadow"
      >
        <MessageCircle className="w-5 h-5" />
        Contact Us on WhatsApp
      </button>

      {/* Contact Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full luxury-shadow-lg">
            <div className="border-b border-luxury-ivory-darker px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-luxury-charcoal">
                  Contact Us on WhatsApp
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-luxury-ivory-dark rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {productName && (
                <div className="bg-luxury-ivory rounded-lg p-4">
                  <p className="text-sm text-luxury-charcoal-light mb-1">
                    Product
                  </p>
                  <p className="font-semibold text-luxury-charcoal">
                    {productName}
                  </p>
                  {productPrice && (
                    <p className="text-luxury-gold font-bold mt-1">
                      {formatPrice(productPrice)}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-luxury-charcoal mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-luxury-charcoal mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-luxury-charcoal mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-luxury-charcoal mb-2">
                  Your Query (Optional)
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  className="w-full px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                />
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="w-full py-4 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Open WhatsApp
              </button>

              <p className="text-xs text-center text-luxury-charcoal-light">
                You&apos;ll be redirected to WhatsApp to send your message
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
