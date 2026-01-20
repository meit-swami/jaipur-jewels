"use client";

import dynamic from "next/dynamic";

// Dynamically import ProductView360 to avoid SSR issues with React Three Fiber
const ProductView360 = dynamic(() => import("@/components/ProductView360"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square bg-luxury-ivory-dark rounded-lg flex items-center justify-center">
      <div className="text-luxury-charcoal-light">Loading 360° view...</div>
    </div>
  ),
});

interface ProductView360WrapperProps {
  imageUrl: string;
}

export default function ProductView360Wrapper({ imageUrl }: ProductView360WrapperProps) {
  return <ProductView360 imageUrl={imageUrl} />;
}
