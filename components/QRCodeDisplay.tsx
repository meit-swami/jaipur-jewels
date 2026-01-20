"use client";

import dynamic from "next/dynamic";

// Dynamically import QR code to avoid SSR issues
const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  {
    ssr: false,
    loading: () => (
      <div className="w-64 h-64 flex items-center justify-center bg-luxury-ivory-dark rounded-lg">
        <p className="text-luxury-charcoal-light">Loading QR code...</p>
      </div>
    ),
  }
);

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 256 }: QRCodeDisplayProps) {
  return (
    <div className="flex items-center justify-center p-4 bg-white rounded-lg">
      <QRCodeSVG
        value={value}
        size={size}
        level="H"
        includeMargin={true}
        fgColor="#2C2C2C"
        bgColor="#FFFFFF"
      />
    </div>
  );
}
