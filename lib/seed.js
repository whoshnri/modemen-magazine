// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const db = new PrismaClient();

const SHOP_CATEGORIES = [
  "New Arrivals",
  "Men's Fashion",
  "Accessories",
  "Grooming & Fragrance",
  "Lifestyle Products",
  "Gift Guides",
  "Brand Collaborations",
  "Advertorial Product Placement"
];

const SAMPLE_PRODUCTS = {
  "New Arrivals": [
    { name: "Limited Edition Bomber Jacket", price: 450.00, stock: 10, image: "/images/products/bomber.jpg", desc: "A classic reborn with modern materials." },
    { name: "Velvet Loafers", price: 295.00, stock: 15, image: "/images/products/loafers.jpg", desc: "Luxurious comfort for evening wear." },
    { name: "Tech-Knit Blazer", price: 350.00, stock: 20, image: "/images/products/blazer.jpg", desc: "Wrinkle-resistant elegance." },
  ],
  "Men's Fashion": [
    { name: "Tailored Italian Suit", price: 1200.00, stock: 5, image: "/images/products/suit.jpg", desc: "Hand-stitched perfection from Milan." },
    { name: "Oxford Cotton Shirt", price: 120.00, stock: 50, image: "/images/products/shirt.jpg", desc: "The staple of every gentleman's wardrobe." },
    { name: "Slim-Fit Chinos", price: 110.00, stock: 40, image: "/images/products/chinos.jpg", desc: "Versatile trousers for any occasion." },
  ],
  "Accessories": [
    { name: "Bespoke Leather Wallet", price: 150.00, stock: 25, image: "/images/products/wallet.jpg", desc: "Full-grain leather with minimal design." },
    { name: "Aviator Sunglasses", price: 180.00, stock: 30, image: "/images/products/glasses.jpg", desc: "Timeless eye protection." },
    { name: "Silk Pocket Square", price: 45.00, stock: 60, image: "/images/products/pocket-square.jpg", desc: "Add a splash of color to your suit." },
  ],
  "Grooming & Fragrance": [
    { name: "Oud & Cedarwood Cologne", price: 220.00, stock: 15, image: "/images/products/cologne.jpg", desc: "A deep, woody scent for the night." },
    { name: "Beard Grooming Kit", price: 85.00, stock: 35, image: "/images/products/beard-kit.jpg", desc: "Everything you need for a pristine beard." },
    { name: "Charcoal Face Wash", price: 35.00, stock: 100, image: "/images/products/face-wash.jpg", desc: "Deep cleaning for city living." },
  ],
  "Lifestyle Products": [
    { name: "Minimalist Desk Lamp", price: 120.00, stock: 20, image: "/images/products/lamp.jpg", desc: "Illuminate your workspace with style." },
    { name: "Premium Coffee Table Book", price: 95.00, stock: 15, image: "/images/products/book.jpg", desc: "A visual journey through automotive history." },
    { name: "Leather Weekender Bag", price: 550.00, stock: 8, image: "/images/products/bag.jpg", desc: "Perfect for quick getaways." },
  ],
  "Gift Guides": [
    { name: "Executive Pen Set", price: 200.00, stock: 12, image: "/images/products/pen.jpg", desc: "For the man who still writes." },
    { name: "Watch Winder Box", price: 350.00, stock: 10, image: "/images/products/watch-winder.jpg", desc: "Keep your automatic watches running." },
  ],
  "Brand Collaborations": [
    { name: "ModeMen x Rolex Vintage", price: 15000.00, stock: 1, image: "/images/products/rolex.jpg", desc: "Exclusive curated vintage timepiece." },
    { name: "ModeMen x Nike Streetwear", price: 250.00, stock: 20, image: "/images/products/sneakers.jpg", desc: "Limited edition sneakers." },
  ],
  "Advertorial Product Placement": [
    { name: "Sponsored: Luxury SUV Experience", price: 5000.00, stock: 5, image: "/images/products/suv.jpg", desc: "Weekend rental of the latest luxury SUV." },
  ]
};

async function main() {
  console.log(`Start seeding ...`);

  // Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await db.user.upsert({
    where: { email: 'henrybassey2007@gmail.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'henrybassey2007@gmail.com',
      name: 'Mode Men Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created/updated.');

  // Seed Categories and Products
  for (const categoryName of SHOP_CATEGORIES) {
    const category = await db.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
        description: `Curated selection for ${categoryName}`
      },
    });

    console.log(`Created Category: ${categoryName}`);

    const products = SAMPLE_PRODUCTS[categoryName] || [];
    for (const productData of products) {
      await db.product.create({
        data: {
          name: productData.name,
          price: productData.price,
          stock: productData.stock,
          image: productData.image,
          desc: productData.desc,
          categories: {
            connect: { id: category.id },
          },
        },
      });
    }
    console.log(`Seeded ${products.length} products for ${categoryName}`);
  }

  // Load and Seed Articles from data.json
  const dataPath = path.join(__dirname, '..', 'data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const articlesData = JSON.parse(rawData);

  console.log(`Seeding ${articlesData.length} articles...`);

  for (const article of articlesData) {
    const { title, body, metadata } = article;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    await db.article.upsert({
      where: { slug },
      update: {},
      create: {
        title,
        slug,
        body,
        writtenBy: metadata.writtenBy,
        publicationDate: new Date(metadata.publicationDate),
        tags: {
          create: metadata.tags.map((tag) => ({
            name: tag,
          })),
        },
      },
    });
  }
  console.log('Articles seeded.');

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });