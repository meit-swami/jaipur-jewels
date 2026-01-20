"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  stockCount: number;
  lowStockThreshold: number;
  stockStatus: string;
}

interface StockManagementModalProps {
  product: Product;
  onClose: () => void;
}

async function updateStock(
  id: string,
  data: { stockCount?: number; lowStockThreshold?: number }
): Promise<Product> {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update stock");
  }
  return res.json();
}

export default function StockManagementModal({
  product,
  onClose,
}: StockManagementModalProps) {
  const [stockCount, setStockCount] = useState(product.stockCount.toString());
  const [lowStockThreshold, setLowStockThreshold] = useState(
    product.lowStockThreshold.toString()
  );
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { stockCount: number; lowStockThreshold: number }) =>
      updateStock(product.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const stock = parseInt(stockCount, 10);
    const threshold = parseInt(lowStockThreshold, 10);

    if (isNaN(stock) || stock < 0) {
      setError("Stock count must be a valid non-negative number");
      return;
    }

    if (isNaN(threshold) || threshold < 0) {
      setError("Low stock threshold must be a valid non-negative number");
      return;
    }

    mutation.mutate({
      stockCount: stock,
      lowStockThreshold: threshold,
    });
  };

  const adjustStock = (delta: number) => {
    const current = parseInt(stockCount, 10) || 0;
    const newValue = Math.max(0, current + delta);
    setStockCount(newValue.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full luxury-shadow-lg">
        <div className="border-b border-luxury-ivory-darker px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-luxury-gold" />
            <h2 className="text-xl font-bold text-luxury-charcoal">
              Stock Management
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-luxury-ivory-dark rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-luxury-charcoal mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-luxury-charcoal-light">
              Current Status:{" "}
              <span className="font-medium capitalize">
                {product.stockStatus.replace("_", " ").toLowerCase()}
              </span>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-luxury-charcoal mb-2">
              Stock Count
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustStock(-1)}
                className="px-3 py-2 bg-luxury-ivory-dark hover:bg-luxury-ivory-darker rounded-lg transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                className="flex-1 px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold text-center font-semibold text-lg"
              />
              <button
                type="button"
                onClick={() => adjustStock(1)}
                className="px-3 py-2 bg-luxury-ivory-dark hover:bg-luxury-ivory-darker rounded-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-charcoal mb-2">
              Low Stock Threshold
            </label>
            <input
              type="number"
              min="0"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="w-full px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            />
            <p className="text-xs text-luxury-charcoal-light mt-1">
              Product will show &quot;Low Stock&quot; when count reaches this threshold
            </p>
          </div>

          <div className="pt-4 border-t border-luxury-ivory-darker flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-luxury-ivory-darker rounded-lg font-medium hover:bg-luxury-ivory-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 px-6 py-3 bg-luxury-charcoal text-luxury-ivory rounded-lg font-medium hover:bg-luxury-charcoal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Stock"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
