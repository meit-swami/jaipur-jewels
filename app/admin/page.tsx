"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import AdminProductForm from "@/components/AdminProductForm";
import StockManagementModal from "@/components/StockManagementModal";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stockStatus: string;
  stockCount: number;
  lowStockThreshold: number;
  featured: boolean;
  category: { name: string; slug: string };
  images: Array<{ url: string; id: string }>;
  videos?: Array<{ url: string; id?: string }>;
  threeDModel?: string | null;
  _count?: { images: number; videos: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// Type for AdminProductForm (with categoryId instead of category object)
interface AdminProductFormProduct {
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

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/admin/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
}

export default function AdminPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<AdminProductFormProduct | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [router]);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const handleEdit = (product: Product) => {
    // Transform product to match AdminProductForm's expected type
    // Find categoryId from categories array based on category slug
    const category = categories.find((cat) => cat.slug === product.category.slug);
    const transformedProduct: AdminProductFormProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      categoryId: category?.id || "",
      images: product.images,
      videos: product.videos?.map((v) => ({ url: v.url })) || [],
      stockCount: product.stockCount,
      lowStockThreshold: product.lowStockThreshold,
      featured: product.featured,
      threeDModel: product.threeDModel || undefined,
    };
    setSelectedProduct(transformedProduct);
    setIsFormOpen(true);
  };

  const handleStock = (product: Product) => {
    setStockProduct(product);
    setIsStockModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  const handleCloseStockModal = () => {
    setIsStockModalOpen(false);
    setStockProduct(null);
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  return (
    <div className="min-h-screen bg-luxury-ivory py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-luxury-charcoal">
              Admin Panel
            </h1>
            <p className="text-luxury-charcoal-light">
              Manage your jewellery products and inventory
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 bg-luxury-charcoal text-luxury-ivory px-6 py-3 rounded-full font-medium hover:bg-luxury-charcoal-light transition-colors luxury-shadow"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Products Table */}
        {productsLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-luxury-gold" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center luxury-shadow">
            <Package className="w-16 h-16 text-luxury-gold-light mx-auto mb-4 opacity-50" />
            <p className="text-xl text-luxury-charcoal-light mb-4">
              No products yet
            </p>
            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-luxury-gold text-white px-6 py-3 rounded-full font-medium hover:bg-luxury-gold-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden luxury-shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-luxury-ivory-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-charcoal">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-charcoal">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-charcoal">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-charcoal">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-charcoal">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-luxury-charcoal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-ivory-darker">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-luxury-ivory">
                      <td className="px-6 py-4">
                        <div className="font-medium text-luxury-charcoal">
                          {product.name}
                        </div>
                        <div className="text-sm text-luxury-charcoal-light">
                          {product._count?.images || 0} image
                          {(product._count?.images || 0) !== 1 ? "s" : ""}
                          {product._count?.videos ? `, ${product._count.videos} video${product._count.videos !== 1 ? "s" : ""}` : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-luxury-charcoal-light">
                        {product.category.name}
                      </td>
                      <td className="px-6 py-4 font-semibold text-luxury-charcoal">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStock(product)}
                          className="text-luxury-charcoal hover:text-luxury-gold transition-colors font-medium"
                        >
                          {product.stockCount} units
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {product.stockStatus === "AVAILABLE" ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            In Stock
                          </span>
                        ) : product.stockStatus === "LOW_STOCK" ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-luxury-charcoal hover:text-luxury-gold hover:bg-luxury-ivory-dark rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Form Modal */}
        {isFormOpen && (
          <AdminProductForm
            product={selectedProduct}
            categories={categories}
            onClose={handleCloseForm}
          />
        )}

        {/* Stock Management Modal */}
        {isStockModalOpen && stockProduct && (
          <StockManagementModal
            product={stockProduct}
            onClose={handleCloseStockModal}
          />
        )}
      </div>
    </div>
  );
}
