import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deepLinks = await prisma.deepLink.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(deepLinks);
  } catch (error) {
    console.error("Error fetching deep links:", error);
    return NextResponse.json(
      { error: "Failed to fetch deep links" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, categoryId, description, order, isActive } = body;

    const deepLink = await prisma.deepLink.create({
      data: {
        name,
        slug,
        categoryId: categoryId || null,
        description: description || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(deepLink, { status: 201 });
  } catch (error) {
    console.error("Error creating deep link:", error);
    return NextResponse.json(
      { error: "Failed to create deep link" },
      { status: 500 }
    );
  }
}
