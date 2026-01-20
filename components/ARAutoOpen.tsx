"use client";

import { useEffect, useState } from "react";
import ARTryOnViewer from "./ARTryOnViewer";

interface ARAutoOpenProps {
  productId: string;
  productName: string;
  productCategory: string;
  threeDModel?: string | null;
  shouldOpen: boolean;
}

export default function ARAutoOpen({
  productId,
  productName,
  productCategory,
  threeDModel,
  shouldOpen,
}: ARAutoOpenProps) {
  const [isOpen, setIsOpen] = useState(shouldOpen);

  useEffect(() => {
    if (shouldOpen) {
      setIsOpen(true);
    }
  }, [shouldOpen]);

  if (!isOpen) return null;

  return (
    <ARTryOnViewer
      productId={productId}
      productName={productName}
      productCategory={productCategory}
      threeDModel={threeDModel}
      onClose={() => setIsOpen(false)}
    />
  );
}
