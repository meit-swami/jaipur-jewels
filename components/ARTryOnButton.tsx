"use client";

import { useState, useEffect } from "react";
import { Camera, QrCode, X } from "lucide-react";
import ARTryOnViewer from "./ARTryOnViewer";
import QRCodeDisplay from "./QRCodeDisplay";

interface ARTryOnButtonProps {
  productId: string;
  productName: string;
  productCategory: string;
  productSlug: string;
  threeDModel?: string | null;
}

export default function ARTryOnButton({
  productId,
  productName,
  productCategory,
  productSlug,
  threeDModel,
}: ARTryOnButtonProps) {
  const [isAROpen, setIsAROpen] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const generateQRUrl = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/products/${productSlug}?ar=true`;
  };

  const handleQRCode = () => {
    setShowQR(true);
  };

  return (
    <>
      <div className="space-y-3">
        <button
          onClick={() => setIsAROpen(true)}
          className="w-full py-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-white rounded-full font-medium hover:from-luxury-gold-dark hover:to-luxury-gold transition-all luxury-shadow flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Try Live on Yourself
        </button>
        
        <button
          onClick={handleQRCode}
          className="w-full py-3 bg-white border-2 border-luxury-gold text-luxury-gold rounded-full font-medium hover:bg-luxury-gold-light/10 transition-colors flex items-center justify-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          Get QR Code for AR
        </button>
      </div>

      {/* AR Viewer Modal */}
      {isAROpen && (
        <ARTryOnViewer
          productId={productId}
          productName={productName}
          productCategory={productCategory}
          threeDModel={threeDModel}
          onClose={() => setIsAROpen(false)}
        />
      )}

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full luxury-shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-luxury-charcoal">
                AR Try-On QR Code
              </h3>
              <button
                onClick={() => setShowQR(false)}
                className="p-2 hover:bg-luxury-ivory-dark rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-luxury-charcoal-light">
                Scan this QR code to open AR try-on on another device
              </p>
              
              {/* QR Code */}
              <div className="flex justify-center">
                <QRCodeDisplay value={generateQRUrl()} size={256} />
              </div>
              
              <p className="text-sm text-luxury-charcoal-light">
                {productName}
              </p>
              
              <a
                href={generateQRUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-luxury-gold hover:underline text-sm"
              >
                Open AR Link
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
