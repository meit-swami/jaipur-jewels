import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "rings" },
      update: {},
      create: {
        name: "Rings",
        slug: "rings",
        description: "Exquisite rings crafted with precision and elegance",
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "necklaces" },
      update: {},
      create: {
        name: "Necklaces",
        slug: "necklaces",
        description: "Timeless necklaces for every occasion",
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "earrings" },
      update: {},
      create: {
        name: "Earrings",
        slug: "earrings",
        description: "Stunning earrings that frame your face beautifully",
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bracelets" },
      update: {},
      create: {
        name: "Bracelets",
        slug: "bracelets",
        description: "Elegant bracelets that add sophistication to any look",
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "anklets" },
      update: {},
      create: {
        name: "Anklets",
        slug: "anklets",
        description: "Delicate anklets that adorn your ankles with grace",
        order: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "tiaras" },
      update: {},
      create: {
        name: "Tiaras",
        slug: "tiaras",
        description: "Regal tiaras for special occasions and celebrations",
        order: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: "crowns" },
      update: {},
      create: {
        name: "Crowns",
        slug: "crowns",
        description: "Majestic crowns fit for royalty and special moments",
        order: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: "pendants" },
      update: {},
      create: {
        name: "Pendants",
        slug: "pendants",
        description: "Beautiful pendants to complement your style",
        order: 8,
      },
    }),
    prisma.category.upsert({
      where: { slug: "brooches" },
      update: {},
      create: {
        name: "Brooches",
        slug: "brooches",
        description: "Elegant brooches to add sophistication to any outfit",
        order: 9,
      },
    }),
    prisma.category.upsert({
      where: { slug: "hair-accessories" },
      update: {},
      create: {
        name: "Hair Accessories",
        slug: "hair-accessories",
        description: "Stylish hair accessories for every occasion",
        order: 10,
      },
    }),
  ]);

  console.log("✅ Categories created");

  const ringsCategory = categories[0];
  const necklacesCategory = categories[1];
  const earringsCategory = categories[2];
  const braceletsCategory = categories[3];

  // Sample Products
  const products = [
    {
      name: "Ethereal Diamond Solitaire Ring",
      price: 12500.0,
      categoryId: ringsCategory.id,
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
      ],
      stockCount: 3,
      lowStockThreshold: 5,
      featured: true,
      aiDescription: "A masterpiece of timeless elegance, this ethereal diamond solitaire ring features a brilliant-cut diamond of exceptional clarity, cradled in a delicate platinum setting. The minimalist design allows the natural beauty of the stone to take center stage, while the comfort-fit band ensures all-day wearability. Perfect for expressing your most heartfelt commitment.",
      tags: ["diamond", "solitaire", "engagement", "platinum", "luxury", "classic"],
    },
    {
      name: "Cascade Pearl Necklace",
      price: 8500.0,
      categoryId: necklacesCategory.id,
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800",
      ],
      stockCount: 7,
      lowStockThreshold: 5,
      featured: true,
      aiDescription: "Draped in sophistication, this cascade pearl necklace showcases lustrous freshwater pearls of varying sizes, hand-selected for their exceptional luster and color uniformity. Each pearl is meticulously knotted and strung with silk, a traditional technique that protects and enhances the pearls' natural beauty. The graduated design creates a waterfall effect that gracefully complements the décolletage.",
      tags: ["pearl", "necklace", "elegant", "classic", "luxury", "sophisticated"],
    },
    {
      name: "Starburst Diamond Earrings",
      price: 9800.0,
      categoryId: earringsCategory.id,
      images: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
        "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800",
      ],
      stockCount: 5,
      lowStockThreshold: 5,
      featured: true,
      aiDescription: "Illuminate your presence with these mesmerizing starburst diamond earrings. Radiating outward from a central brilliant-cut diamond, delicate pavé-set diamonds create a celestial sparkle that catches the light from every angle. Crafted in 18-karat white gold, these statement earrings embody modern luxury while maintaining an ethereal lightness.",
      tags: ["diamond", "earrings", "pavé", "white gold", "luxury", "statement"],
    },
    {
      name: "Infinity Gold Bracelet",
      price: 3200.0,
      categoryId: braceletsCategory.id,
      images: [
        "https://images.unsplash.com/photo-1611955167811-4711904bb9f0?w=800",
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800",
      ],
      stockCount: 12,
      lowStockThreshold: 5,
      featured: false,
      aiDescription: "Symbolizing eternal love and infinite possibilities, this gold bracelet features an elegantly twisted infinity motif crafted from 18-karat yellow gold. The fluid, organic design wraps around the wrist with supple grace, while the polished finish reflects light beautifully. A perfect everyday luxury piece that speaks to both tradition and contemporary style.",
      tags: ["gold", "bracelet", "infinity", "yellow gold", "elegant", "symbolic"],
    },
    {
      name: "Rose Gold Vintage Ring",
      price: 4500.0,
      categoryId: ringsCategory.id,
      images: [
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800",
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
      ],
      stockCount: 8,
      lowStockThreshold: 5,
      featured: false,
      aiDescription: "Embrace the romantic allure of this rose gold vintage-inspired ring. Artfully designed with intricate filigree details and accented by a cluster of smaller diamonds, this piece captures the essence of bygone elegance while remaining perfectly suited for modern wear. The warm rose gold hue complements all skin tones, making it a versatile addition to any collection.",
      tags: ["rose gold", "vintage", "filigree", "diamonds", "romantic", "elegant"],
    },
    {
      name: "Layered Gemstone Necklace",
      price: 6200.0,
      categoryId: necklacesCategory.id,
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800",
      ],
      stockCount: 6,
      lowStockThreshold: 5,
      featured: false,
      aiDescription: "Create depth and dimension with this stunning layered gemstone necklace. Featuring three graduated strands of emerald-cut sapphires, each strand is carefully spaced to create visual interest without overwhelming. Set in white gold with secure prong settings, this contemporary design allows each gemstone to showcase its individual brilliance while working in perfect harmony.",
      tags: ["sapphire", "gemstone", "layered", "white gold", "contemporary", "luxury"],
    },
  ];

  // Create Products
  for (const productData of products) {
    const { images, tags, ...productInfo } = productData;
    
    // Check if product already exists
    const slug = productInfo.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (!existingProduct) {
      const stockStatus =
        productInfo.stockCount === 0
          ? "OUT_OF_STOCK"
          : productInfo.stockCount <= productInfo.lowStockThreshold
          ? "LOW_STOCK"
          : "AVAILABLE";

      await prisma.product.create({
        data: {
          ...productInfo,
          slug,
          stockStatus,
          tags: JSON.stringify(tags),
          images: {
            create: images.map((url, index) => ({
              url,
              alt: `${productInfo.name} - Image ${index + 1}`,
              order: index,
            })),
          },
        },
      });
      console.log(`✅ Created product: ${productInfo.name}`);
    } else {
      console.log(`⏭️  Product already exists: ${productInfo.name}`);
    }
  }

  const ankletsCategory = categories[4];
  const tiarasCategory = categories[5];
  const crownsCategory = categories[6];
  const pendantsCategory = categories[7];
  const broochesCategory = categories[8];
  const hairAccessoriesCategory = categories[9];

  // Create Deep Links
  const deepLinks = [
    {
      name: "Shop All Rings",
      slug: "rings",
      categoryId: ringsCategory.id,
      description: "Browse our complete collection of rings",
      order: 1,
    },
    {
      name: "Shop All Necklaces",
      slug: "necklaces",
      categoryId: necklacesCategory.id,
      description: "Explore elegant necklaces",
      order: 2,
    },
    {
      name: "Shop All Earrings",
      slug: "earrings",
      categoryId: earringsCategory.id,
      description: "Discover stunning earrings",
      order: 3,
    },
    {
      name: "Shop All Bracelets",
      slug: "bracelets",
      categoryId: braceletsCategory.id,
      description: "Find your perfect bracelet",
      order: 4,
    },
    {
      name: "Shop All Anklets",
      slug: "anklets",
      categoryId: ankletsCategory.id,
      description: "Explore delicate anklets",
      order: 5,
    },
    {
      name: "Shop All Tiaras",
      slug: "tiaras",
      categoryId: tiarasCategory.id,
      description: "Discover regal tiaras",
      order: 6,
    },
    {
      name: "Shop All Crowns",
      slug: "crowns",
      categoryId: crownsCategory.id,
      description: "Browse majestic crowns",
      order: 7,
    },
    {
      name: "Featured Collection",
      slug: "featured",
      categoryId: null,
      description: "Handpicked featured pieces",
      order: 8,
    },
  ];

  for (const linkData of deepLinks) {
    await prisma.deepLink.upsert({
      where: { slug: linkData.slug },
      update: {},
      create: linkData,
    });
  }

  console.log("✅ Deep links created");
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
