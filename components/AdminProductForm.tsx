"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2, Upload, Image as ImageIcon, Video } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  images: Array<{ url: string; id: string }>;
  videos?: Array<{ url: string }>;
  stockCount: number;
  lowStockThreshold: number;
  featured: boolean;
  threeDModel?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface AdminProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
}

async function createProduct(data: any): Promise<Product> {
  const res = await fetch("/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create product");
  }
  return res.json();
}

async function updateProduct(id: string, data: any): Promise<Product> {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update product");
  }
  return res.json();
}

export default function AdminProductForm({
  product,
  categories,
  onClose,
}: AdminProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price.toString() || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || "");
  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images.map((img) => img.url) || []
  );
  const [videoUrls, setVideoUrls] = useState<string[]>(
    product?.videos?.map((v) => v.url) || []
  );
  const [stockCount, setStockCount] = useState(product?.stockCount.toString() || "0");
  const [lowStockThreshold, setLowStockThreshold] = useState(
    product?.lowStockThreshold.toString() || "5"
  );
  const [featured, setFeatured] = useState(product?.featured || false);
  const [threeDModel, setThreeDModel] = useState(product?.threeDModel || "");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (product) {
        return updateProduct(product.id, data);
      }
      return createProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !price || !categoryId || imageUrls.length === 0) {
      setError("Please fill in all required fields and add at least one image");
      return;
    }

    const data = {
      name,
      price: parseFloat(price),
      categoryId,
      images: imageUrls,
      videos: videoUrls.length > 0 ? videoUrls : undefined,
      stockCount: parseInt(stockCount) || 0,
      lowStockThreshold: parseInt(lowStockThreshold) || 5,
      featured,
      threeDModel: threeDModel || undefined,
    };

    mutation.mutate(data);
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const addVideoUrl = () => {
    if (newVideoUrl.trim()) {
      setVideoUrls([...videoUrls, newVideoUrl.trim()]);
      setNewVideoUrl("");
    }
  };

  const removeVideoUrl = (index: number) => {
    setVideoUrls(videoUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto luxury-shadow-lg">
        <div className="sticky top-0 bg-white border-b border-luxury-ivory-darker px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-luxury-charcoal">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-luxury-ivory-dark rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-luxury-charcoal mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-luxury-charcoal mb-2">
              Price INR ₹ *
            </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-charcoal mb-2">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-charcoal mb-2">
              Images (URLs) *
            </label>
            <div className="space-y-2">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-luxury-ivory rounded-lg"
                >
                  <ImageIcon className="w-4 h-4 text-luxury-gold" />
                  <span className="flex-1 text-sm truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-4 py-2 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold-dark transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-charcoal mb-2">
              Videos (URLs) - Optional
            </label>
            <div className="space-y-2">
              {videoUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-luxury-ivory rounded-lg"
                >
                  <Video className="w-4 h-4 text-luxury-gold" />
                  <span className="flex-1 text-sm truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeVideoUrl(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="flex-1 px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addVideoUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addVideoUrl}
                  className="px-4 py-2 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold-dark transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-luxury-charcoal mb-2">
                Stock Count
              </label>
              <input
                type="number"
                min="0"
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                className="w-full px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              />
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
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-luxury-charcoal mb-2">
              3D Model URL (for AR) - Optional
            </label>
            <input
              type="url"
              value={threeDModel}
              onChange={(e) => setThreeDModel(e.target.value)}
              placeholder="https://example.com/model.glb"
              className="w-full px-4 py-2 border border-luxury-ivory-darker rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-luxury-gold focus:ring-luxury-gold border-luxury-ivory-darker rounded"
            />
            <label htmlFor="featured" className="text-sm font-medium text-luxury-charcoal">
              Featured Product
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-luxury-ivory-darker">
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
                  {product ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{product ? "Update Product" : "Create Product"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
