import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ARTryOnButton from "@/components/ARTryOnButton";
import ProductClientWrapper from "@/components/ProductClientWrapper";
import WhatsAppContact from "@/components/WhatsAppContact";
import ProductView360Wrapper from "@/components/ProductView360Wrapper";
import { ShoppingBag, AlertCircle, CheckCircle2 } from "lucide-react";
type StockStatus = "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK";

function toStockStatus(status: string): StockStatus {
  if (status === "AVAILABLE" || status === "LOW_STOCK" || status === "OUT_OF_STOCK") {
    return status as StockStatus;
  }
  return "AVAILABLE"; // Default fallback
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        videos: {
          orderBy: { order: "asc" },
        },
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getStockStatusBadge(status: string, count: number): JSX.Element {
  const stockStatus: StockStatus = toStockStatus(status);
  switch (stockStatus) {
    case "OUT_OF_STOCK":
      return (
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Out of Stock</span>
        </div>
      );
    case "LOW_STOCK":
      return (
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Low Stock ({count} remaining)</span>
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">In Stock ({count} available)</span>
        </div>
      );
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Jaipuri Jewels`,
    description: product.aiDescription || product.description || `${product.name} - ${formatPrice(product.price)}`,
    openGraph: {
      title: product.name,
      description: product.aiDescription || product.description || "",
      images: product.images[0] ? [product.images[0].url] : [],
      price: product.price,
      currency: "INR",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const tags = JSON.parse(product.tags || "[]") as string[];
  const has360View = product.images.some((img) => img.is360);
  const primary360Image = product.images.find((img) => img.is360);

  return (
    <div className="min-h-screen bg-luxury-ivory py-12 px-4">
      {/* Auto-open AR if QR code scanned */}
      <ProductClientWrapper
        productId={product.id}
        productName={product.name}
        productCategory={product.category.name}
        threeDModel={product.threeDModel}
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {has360View && primary360Image && (
              <div className="bg-white rounded-2xl p-6 luxury-shadow">
                <h3 className="text-lg font-semibold mb-4 text-luxury-charcoal">
                  360° View
                </h3>
                <ProductView360Wrapper imageUrl={primary360Image.url} />
              </div>
            )}

            {/* Main Image */}
            {product.images[0] && (
              <div className="relative aspect-square bg-luxury-ivory-dark rounded-2xl overflow-hidden luxury-shadow">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-square bg-luxury-ivory-dark rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, 200px"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Videos */}
            {product.videos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-luxury-charcoal">
                  Videos
                </h3>
                {product.videos.map((video) => (
                  <div
                    key={video.id}
                    className="relative aspect-video bg-luxury-ivory-dark rounded-2xl overflow-hidden"
                  >
                    <video
                      src={video.url}
                      controls
                      className="w-full h-full object-contain"
                      poster={video.thumbnail || undefined}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* AR Try-On - Always available */}
            <div className="bg-white rounded-2xl p-6 luxury-shadow">
              <h3 className="text-lg font-semibold mb-4 text-luxury-charcoal">
                Try On with AR
              </h3>
              <ARTryOnButton
                productId={product.id}
                productName={product.name}
                productCategory={product.category.name}
                productSlug={product.slug}
                threeDModel={product.threeDModel}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-luxury-gold mb-2 uppercase tracking-wide">
                {product.category.name}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-luxury-charcoal">
                {product.name}
              </h1>
              <div className="text-4xl font-bold text-luxury-gold mb-6">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Stock Status */}
            {getStockStatusBadge(product.stockStatus, product.stockCount)}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-luxury-ivory-dark text-luxury-charcoal-light text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* AI Description */}
            {product.aiDescription && (
              <div className="bg-white rounded-2xl p-6 luxury-shadow">
                <h2 className="text-2xl font-bold mb-4 text-luxury-charcoal">
                  About This Piece
                </h2>
                <p className="text-luxury-charcoal-light leading-relaxed whitespace-pre-line">
                  {product.aiDescription}
                </p>
              </div>
            )}

            {/* Description fallback */}
            {!product.aiDescription && product.description && (
              <div className="bg-white rounded-2xl p-6 luxury-shadow">
                <h2 className="text-2xl font-bold mb-4 text-luxury-charcoal">
                  Description
                </h2>
                <p className="text-luxury-charcoal-light leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Info */}
            <div className="bg-white rounded-2xl p-6 luxury-shadow space-y-4">
              <h3 className="text-xl font-bold text-luxury-charcoal">
                Product Information
              </h3>
              <div className="space-y-2 text-luxury-charcoal-light">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{product.category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="font-medium">{product.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock Status:</span>
                  <span className="font-medium capitalize">
                    {product.stockStatus.replace("_", " ").toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Contact Button */}
            <div className="pt-6">
              <WhatsAppContact
                productId={product.id}
                productName={product.name}
                productPrice={product.price}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
