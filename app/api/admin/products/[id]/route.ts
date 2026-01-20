import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().optional(),
  stockCount: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  stockStatus: z.enum(["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK"]).optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  threeDModel: z.string().optional(),
});

function calculateStockStatus(
  stockCount: number,
  lowStockThreshold: number
): "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" {
  if (stockCount === 0) return "OUT_OF_STOCK";
  if (stockCount <= lowStockThreshold) return "LOW_STOCK";
  return "AVAILABLE";
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    // If stockCount or lowStockThreshold is updated, recalculate stockStatus
    if (validatedData.stockCount !== undefined || validatedData.lowStockThreshold !== undefined) {
      const currentProduct = await prisma.product.findUnique({
        where: { id },
        select: { stockCount: true, lowStockThreshold: true },
      });

      if (!currentProduct) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      const newStockCount = validatedData.stockCount ?? currentProduct.stockCount;
      const newLowStockThreshold = validatedData.lowStockThreshold ?? currentProduct.lowStockThreshold;
      
      validatedData.stockStatus = calculateStockStatus(newStockCount, newLowStockThreshold);
    }

    // Handle images and videos separately if provided
    const { images, videos, ...updateData } = validatedData;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: true,
        videos: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
