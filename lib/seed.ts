// lib/seed.ts
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import db from './prisma'; // Ensure this path is correct for your project structure
import { EventType, ProductType } from './generated/prisma/enums'; // Ensure this path matches your generated client

// --- STOCK CSV FILE CONFIGURATION ---

interface StockFileConfig {
  filename: string;
  category: string;
  itemType: ProductType;
}

const STOCK_FILES: StockFileConfig[] = [
  { filename: 'Bags.csv', category: 'Accessories', itemType: ProductType.BAGS },
  { filename: 'Belts.csv', category: 'Accessories', itemType: ProductType.BELTS },
  { filename: 'Blazers.csv', category: "Men's Fashion", itemType: ProductType.BLAZERS },
  { filename: 'Face caps.csv', category: 'Accessories', itemType: ProductType.CAPS },
  { filename: 'Jeans.csv', category: "Men's Fashion", itemType: ProductType.JEANS },
  { filename: 'Jogers.csv', category: "Men's Fashion", itemType: ProductType.JOGGERS },
  { filename: "Men's Perfumes.csv", category: 'Grooming & Fragrance', itemType: ProductType.PERFUMES },
  { filename: "Men's Sunglasses.csv", category: 'Accessories', itemType: ProductType.SUNGLASSES },
  { filename: 'Mens Frames.csv', category: 'Accessories', itemType: ProductType.FRAMES },
  { filename: 'Office shirts.csv', category: "Men's Fashion", itemType: ProductType.SHIRTS },
  { filename: 'Perfumes set.csv', category: 'Grooming & Fragrance', itemType: ProductType.PERFUMES },
  { filename: 'Polo.csv', category: "Men's Fashion", itemType: ProductType.POLOS },
  { filename: 'Shoes.csv', category: "Men's Fashion", itemType: ProductType.SHOES },
  { filename: 'Short Nikkas.csv', category: "Men's Fashion", itemType: ProductType.SHORTS },
  { filename: 'Sweaters.csv', category: "Men's Fashion", itemType: ProductType.SWEATERS },
  { filename: 'T-Shirts.csv', category: "Men's Fashion", itemType: ProductType.TSHIRTS },
  { filename: 'wallet.csv', category: 'Accessories', itemType: ProductType.WALLETS },
  { filename: "Women's Perfumes set.csv", category: 'Grooming & Fragrance', itemType: ProductType.PERFUMES },
  { filename: "Women's Perfumes.csv", category: 'Grooming & Fragrance', itemType: ProductType.PERFUMES },
  { filename: 'Womens frames.csv', category: 'Accessories', itemType: ProductType.FRAMES },
  { filename: 'womens sunglasses.csv', category: 'Accessories', itemType: ProductType.SUNGLASSES },
];

// --- DATA DEFINITIONS ---

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

const EVENTS = [
  {
    id: '1',
    title: 'Mode Men Annual Gala',
    location: 'Eko Hotel & Suites, Lagos',
    image: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FsYXxlbnwwfHwwfHx8MA%3D%3D',
    slug: 'annual-gala-2024',
    price: 250000,
    type: 'PAID',
    featured: true,
    description: "Celebrate the year's achievements in style at the prestigious Mode Men Annual Gala. Join industry leaders, cultural icons, and tastemakers for an evening of fine dining, entertainment, and networking.",
    time: "6:00 PM Red Carpet | 7:30 PM Dinner",
    dressCode: "Black Tie",
    daysFromNow: 30 // Future event
  },
  {
    id: '2',
    title: 'Lagos Fashion Week: VIP Lounge',
    location: 'Federal Palace Hotel',
    image: 'https://images.unsplash.com/photo-1543728069-a3f97c5a2f32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMHdlZWt8ZW58MHx8MHx8fDA%3D',
    slug: 'lfw-vip-lounge',
    price: 100000,
    type: 'PAID',
    featured: false,
    description: "Experience Lagos Fashion Week from the comfort of the Mode Men VIP Lounge. Enjoy front-row access, complimentary refreshments, and exclusive meet-and-greets with designers.",
    time: "All Day Access",
    dressCode: "Fashion Forward",
    daysFromNow: 14
  },
  {
    id: '3',
    title: 'Whisky & Watches: Private Tasting',
    location: 'The Wheatbaker, Ikoyi',
    image: 'https://images.unsplash.com/photo-1625922379195-3f891e47eaee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdpbmUlMjB0YXN0aW5nfGVufDB8fDB8fHww',
    slug: 'whisky-watches-tasting',
    price: 80000,
    type: 'INVITE_ONLY',
    featured: false,
    description: "An intimate evening exploring the finest whiskies and timepieces. Hosted by our Editor-in-Chief, this exclusive event is strictly by invitation for our most discerning members.",
    time: "7:00 PM - 10:00 PM",
    dressCode: "Smart Casual",
    daysFromNow: 5
  },
  {
    id: '4',
    title: 'Tech & Innovation Summit',
    location: 'Landmark Centre, Victoria Island',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop&q=60',
    slug: 'tech-innovation-summit',
    price: 15000,
    type: 'PAID',
    featured: false,
    description: "A gathering of the brightest minds in the African tech ecosystem. Discussing the future of fintech, agritech, and AI in Africa.",
    time: "9:00 AM - 5:00 PM",
    dressCode: "Business Casual",
    daysFromNow: 20
  },
  {
    id: '5',
    title: 'Modern Art Exhibition Opening',
    location: 'Nike Art Gallery',
    image: 'https://images.unsplash.com/photo-1536924940846-572e9110e5fb?w=500&auto=format&fit=crop&q=60',
    slug: 'modern-art-exhibition',
    price: 0,
    type: 'FREE',
    featured: false,
    description: "The grand opening of 'Visions of Tomorrow', a curated exhibition featuring contemporary African artists pushing boundaries.",
    time: "6:00 PM - 9:00 PM",
    dressCode: "Artistic / Casual",
    daysFromNow: 8
  },
  {
    id: '6',
    title: 'Polo Tournament Finals',
    location: 'Lagos Polo Club, Ikoyi',
    image: 'https://images.unsplash.com/photo-1551069796-0f81a70ce15f?w=500&auto=format&fit=crop&q=60',
    slug: 'polo-tournament-finals',
    price: 50000,
    type: 'PAID',
    featured: true,
    description: "Witness current champions defend their title in the most thrilling match of the season. High society meets high intensity sport.",
    time: "2:00 PM - 6:00 PM",
    dressCode: "Polo Chic",
    daysFromNow: 45
  }
];

const INTERVIEWS = [
  {
    id: '1',
    name: 'Davido',
    role: 'Musician & Mogul',
    title: 'Timeless Influence',
    image: 'https://i.pinimg.com/236x/e2/6c/58/e26c58c7838e1fb7c34aa73e6384eee6.jpg',
    slug: 'davido-timeless-influence',
    content: "This interview featured famous artist, influencer and celebrity Davido. It covered his journey from to becoming the successful voice that he is today. He shared his experiences and insights on the music industry and the impact of social media on the industry."
  },
  {
    id: '2',
    name: 'Tony Elumelu',
    role: 'Philanthropist & Entrepreneur',
    title: 'The Art of Africapitalism',
    image: 'https://i.pinimg.com/736x/cd/22/82/cd2282c4d3e4c9719ecfd16f7c94013b.jpg',
    slug: 'tony-elumelu-africapitalism',
    content: "This interview featured Tony Elumelu, the founder of the Tony Elumelu Foundation. It covered his journey from to becoming the successful voice that he is today. He shared his experiences and insights on the impact of social media on the industry."
  },
  {
    id: '3',
    name: 'Chimamanda N. Adichie',
    role: 'Author & Speaker',
    title: 'Stories That Matter',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
    slug: 'chimamanda-stories-matter',
    content: "<p>In a world desperate for authentic narratives, Chimamanda Ngozi Adichie continues to be a beacon of truth. We sat down with the literary giant to discuss her latest work, the role of storytelling in shaping identity, and her hopes for the next generation of African writers.</p><p>She speaks with the same precision and grace that characterizes her writing, offering insights that are both profound and deeply personal.</p>"
  },
  {
    id: '4',
    name: 'Burna Boy',
    role: 'Afro-Fusion Giant',
    title: 'Conquering the World',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&auto=format&fit=crop&q=60',
    slug: 'burna-boy-conquering-world',
    content: "<p>From Port Harcourt to Madison Square Garden, Burna Boy's journey has been nothing short of meteoric. In this candid interview, the African Giant opens up about the pressure of representing a continent, his creative process, and what he believes is the true essence of African music.</p><p>'I don't just make music for the clubs,' he tells us. 'I make music for the soul, for the history books.'</p>"
  },
  {
    id: '5',
    name: 'Aliko Dangote',
    role: 'Business Titan',
    title: 'Building an Empire',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d6229b?w=500&auto=format&fit=crop&q=60',
    slug: 'aliko-dangote-building-empire',
    content: "<p>Africa's richest man is not slowing down. With the launch of the new refinery, Aliko Dangote is poised to transform the continent's energy landscape. We explore the man behind the billions, his daily routine, and his vision for a self-sufficient Africa.</p><p>It is a masterclass in resilience, vision, and the sheer grit required to build something that outlasts you.</p>"
  },
  {
    id: '6',
    name: 'Tiwa Savage',
    role: 'Queen of Afrobeats',
    title: 'Water & Fire',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&auto=format&fit=crop&q=60',
    slug: 'tiwa-savage-water-fire',
    content: "<p>Tiwa Savage has seen it all. The highs, the lows, and everything in between. As she prepares to release her new movie and album, she reflects on her career longevity, navigating a male-dominated industry, and finding peace in the chaos.</p><p>This is Tiwa as you've rarely seen her: vulnerable, powerful, and utterly unapologetic.</p>"
  }
];


const MOCK_ISSUES = [
  {
    id: 'issue-1',
    title: 'The Renaissance Issue',
    releaseDate: new Date('2025-12-01'),
    coverImage: 'https://images.unsplash.com/photo-1544654803-b69140b285a1?w=500&auto=format&fit=crop&q=60',
    description: 'Exploring the rebirth of African luxury fashion and the new guard of designers redefining the global stage.',
    teaserText: 'The New African Luxury',
    viewLink: 'https://example.com/read/renaissance',
    buyLink: 'https://example.com/buy/renaissance',
  },
  {
    id: 'issue-2',
    title: 'The Power List 2024',
    releaseDate: new Date('2024-11-01'),
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
    description: 'Our annual ranking of the most influential men in business, politics, and culture across the continent.',
    teaserText: 'Who Runs Africa?',
    viewLink: 'https://example.com/read/power-list-2024',
  },
  {
    id: 'issue-3',
    title: 'Tech Titans',
    releaseDate: new Date('2024-10-01'),
    coverImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60',
    description: 'Inside the minds of the founders building the next unicorns. Exclusive interviews with the creators of Flutterwave, Paystack, and more.',
    teaserText: 'Building the Future',
    viewLink: 'https://example.com/read/tech-titans',
    buyLink: 'https://example.com/buy/tech-titans',
  },
  {
    id: 'issue-4',
    title: 'The Art of Living',
    releaseDate: new Date('2024-09-01'),
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60',
    description: 'A dedicated issue to architecture, interior design, and the finest properties in Lagos, Cape Town, and Nairobi.',
    teaserText: 'Curating Your Space',
    viewLink: 'https://example.com/read/art-of-living',
  },
  {
    id: 'issue-5',
    title: 'Summer Escapes',
    releaseDate: new Date('2024-08-01'),
    coverImage: 'https://images.unsplash.com/photo-1571896349842-68c69102d289?w=500&auto=format&fit=crop&q=60',
    description: 'The ultimate guide to luxury travel. Hidden gems in Zanzibar, the best resorts in Seychelles, and city breaks in Marrakech.',
    teaserText: 'Wanderlust Defined',
    viewLink: 'https://example.com/read/summer-escapes',
    buyLink: 'https://example.com/buy/summer-escapes',
  },
  {
    id: 'issue-6',
    title: 'The Gentleman\'s Guide',
    releaseDate: new Date('2024-07-01'),
    coverImage: 'https://images.unsplash.com/photo-1617137968427-85924c809a22?w=500&auto=format&fit=crop&q=60',
    description: 'Essential etiquette, style rules, and grooming tips for the modern man. Mastering the art of being a gentleman in 2024.',
    teaserText: 'Timeless Elegance',
    viewLink: 'https://example.com/read/gentlemans-guide',
  },
  {
    id: 'issue-7',
    title: 'Wheels & Watches',
    releaseDate: new Date('2024-06-01'),
    coverImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&auto=format&fit=crop&q=60',
    description: 'A high-octane issue featuring the latest supercars and the most complicated timepieces from Geneva.',
    teaserText: 'Precision Engineering',
    viewLink: 'https://example.com/read/wheels-watches',
    buyLink: 'https://example.com/buy/wheels-watches',
  },
  {
    id: 'issue-8',
    title: 'Culinary Journeys',
    releaseDate: new Date('2024-05-01'),
    coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&auto=format&fit=crop&q=60',
    description: 'Exploring the diverse flavors of African cuisine. From street food in Accra to fine dining in Johannesburg.',
    teaserText: 'Taste of Africa',
    viewLink: 'https://example.com/read/culinary-journeys',
  },
  {
    id: 'issue-9',
    title: 'The Business of Sport',
    releaseDate: new Date('2024-04-01'),
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=60',
    description: 'How African athletes are becoming global brands. The economics of football, basketball, and boxing on the continent.',
    teaserText: 'Game Changers',
    viewLink: 'https://example.com/read/business-sport',
    buyLink: 'https://example.com/buy/business-sport',
  },
  {
    id: 'issue-10',
    title: 'Music & Culture',
    releaseDate: new Date('2024-03-01'),
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
    description: 'The global takeover of Afrobeats. Coverage of the biggest festivals and interviews with rising stars.',
    teaserText: 'The Beat Goes On',
    viewLink: 'https://example.com/read/music-culture',
  },
];

const ADS = [
  {
    title: "Rolex Submariner",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&auto=format&fit=crop&q=60",
    link: "/shop/product/rolex-submariner",
    active: true
  },
  {
    title: "Tom Ford Suit",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c472997?w=500&auto=format&fit=crop&q=60",
    link: "/shop/product/tom-ford-suit",
    active: true
  },
  {
    title: "Gucci Loafers",
    image: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=500&auto=format&fit=crop&q=60",
    link: "/shop/product/gucci-loafers",
    active: true
  }
];

// --- STOCK CSV SEEDING FUNCTION ---

/**
 * Parse and seed products from stock CSV files
 */
async function seedStockProducts(): Promise<number> {
  console.log('\n📦 Starting Stock Products Seeding...');
  console.log('='.repeat(50));

  const stockDir = path.join(process.cwd(), 'stock');
  let totalProducts = 0;

  // First ensure categories exist
  const categoryMap = new Map<string, string>();
  for (const config of STOCK_FILES) {
    if (!categoryMap.has(config.category)) {
      const cat = await db.category.upsert({
        where: { name: config.category },
        update: {},
        create: { name: config.category, description: `Products for ${config.category}` }
      });
      categoryMap.set(config.category, cat.id);
    }
  }

  for (const config of STOCK_FILES) {
    const filePath = path.join(stockDir, config.filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${config.filename}`);
      continue;
    }

    interface recordSchema {
      Designer: string | null;
      Color: string | null;
      Description: string | null;
      Size: string | null;
      Price: string | null;
      Opening_Stock: string | null;
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      }) as recordSchema[];

      let fileProductCount = 0;
      const categoryId = categoryMap.get(config.category)!;

      for (const row of records) {
        // Skip TOTAL rows and empty rows
        const rowValues = Object.values(row).join('').toLowerCase();
        if (rowValues.includes('total') || rowValues.trim() === '') continue;

        // Extract fields from various column names (CSVs have inconsistent headers)
        const designer = row['Designer'] || "Modemen"
        const color = row['Color'] || '';
        const description = row['Description'] || '';
        const size = row['Size'] || '';

        // Get price - handle various formats like "£ 500.00", "$250", "250"
        let priceStr = row['Price'] || '0';
        // Clean the price string
        priceStr = priceStr.toString().replace(/[£$,\s]/g, '').trim();
        const price = parseFloat(priceStr) || 0;

        // Get stock quantity
        const stockStr = row['Opening_Stock'] || '1';
        const stock = parseInt(stockStr) || 1;

        // Skip if no meaningful data
        if (!designer && !description) continue;

        // Create product name from designer + description
        const productName = [designer, description].filter(Boolean).join(' - ') || `Product from ${config.filename}`;

        // Get product type from filename for image placeholder

        const productType = config.filename.replace('.csv', '').toLowerCase();

        // Check for existing product with same name in category
        const existingProduct = await db.product.findFirst({
          where: {
            name: productName,
            categories: { some: { id: categoryId } }
          }
        });

        if (existingProduct) {
          // Update existing product
          await db.product.update({
            where: { id: existingProduct.id },
            data: {
              price: price > 0 ? price : existingProduct.price,
              stock,
              designer: designer || existingProduct.designer,
              color: color || existingProduct.color,
              size: size || existingProduct.size,
              itemType: config.itemType,
            }
          });
        } else {
          // Create new product
          await db.product.create({
            data: {
              name: productName,
              price,
              stock,
              designer: designer || null,
              color: color || null,
              size: size || null,
              desc: description || null,
              itemType: config.itemType,
              image: `/images/products/${productType}.jpg`,
              categories: { connect: { id: categoryId } },
            }
          });
          fileProductCount++;
        }
      }

      totalProducts += fileProductCount;
      console.log(`✅ ${config.filename.padEnd(25)} → ${fileProductCount} new products (${config.category})`);

    } catch (error) {
      console.error(`❌ Error processing ${config.filename}:`, error);
    }
  }

  console.log('='.repeat(50));
  console.log(`📦 Stock Seeding Complete: ${totalProducts} total new products added\n`);

  return totalProducts;
}

// --- MAIN SEED FUNCTION ---

async function main() {
  console.log(`Start seeding ...`);

  // 1. Create/Update Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await db.user.upsert({
    where: { email: 'henrybassey2007@gmail.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'henrybassey2007@gmail.com',
      name: 'Mode Men Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user seeded.');

  // 2. Seed Interviews (MOVED OUTSIDE CATEGORY LOOP)
  console.log('Seeding Interviews...');
  for (const interview of INTERVIEWS) {
    await db.interview.upsert({
      where: { slug: interview.slug },
      update: {
        people: interview.name,
        tagline: interview.role,
        title: interview.title,
        coverImage: interview.image,
        content: interview.content,
      },
      create: {
        people: interview.name,
        tagline: interview.role,
        title: interview.title,
        coverImage: interview.image,
        content: interview.content,
        slug: interview.slug,
      },
    });
  }
  console.log(`${INTERVIEWS.length} Interviews seeded.`);

  // 3. Seed Categories and Products
  console.log('Seeding Categories and Products...');
  for (const categoryName of SHOP_CATEGORIES) {
    // Upsert Category
    const category = await db.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
        description: `Curated selection for ${categoryName}`
      },
    });

    // Create Products for this Category

  }

  // 3b. Seed Stock Products from CSV files
  await seedStockProducts();

  // 4. Seed Events
  console.log('Seeding Events...');
  for (const event of EVENTS) {
    // Calculate a dynamic date based on 'daysFromNow' or default to now
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + (event.daysFromNow || 0));

    await db.event.upsert({
      where: { id: event.id }, // Assuming ID is the unique identifier
      update: {
        title: event.title,
        location: event.location,
        imageUrl: event.image,
        slug: event.slug,
        price: event.price,
        featured: event.featured,
        description: event.description,
        type: event.type as EventType,
        date: eventDate,
      },
      create: {
        id: event.id,
        title: event.title,
        location: event.location,
        imageUrl: event.image,
        slug: event.slug,
        price: event.price,
        featured: event.featured,
        description: event.description,
        type: event.type as EventType,
        date: eventDate,
      },
    });
  }
  console.log(`${EVENTS.length} Events seeded.`);

  // 5. Load and Seed Articles
  const dataPath = path.join(process.cwd(), 'data.json');
  if (fs.existsSync(dataPath)) {
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const articlesData = JSON.parse(rawData);

    console.log(`Seeding ${articlesData.length} articles...`);

    for (const article of articlesData) {
      const { title, body, metadata } = article;
      // Simple slugify
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      await db.article.upsert({
        where: { slug },
        update: {
          category: metadata.category,
          subcategory: metadata.subcategory,
          bannerImage: article.bannerImage || metadata.bannerImage,
          body, // Update body if it changed in JSON
          writtenBy: metadata.writtenBy,
        },
        create: {
          title,
          slug,
          body,
          writtenBy: metadata.writtenBy,
          publicationDate: new Date(metadata.publicationDate),
          bannerImage: article.bannerImage || metadata.bannerImage,
          category: metadata.category,
          subcategory: metadata.subcategory,
        },
      });
    }
    console.log('Articles seeded.');
  } else {
    console.log('data.json not found, skipping articles.');
  }

  // 6. Seed Issues
  console.log('Seeding Issues...');
  for (const issue of MOCK_ISSUES) {
    await db.issues.upsert({
      where: { id: issue.id },
      update: {
        title: issue.title,
        releaseDate: issue.releaseDate,
        coverImage: issue.coverImage,
        description: issue.description,
        teaserText: issue.teaserText,
        viewLink: issue.viewLink,
        buyLink: issue.buyLink,
      },
      create: {
        id: issue.id,
        title: issue.title,
        releaseDate: issue.releaseDate,
        coverImage: issue.coverImage,
        description: issue.description,
        teaserText: issue.teaserText,
        viewLink: issue.viewLink,
        buyLink: issue.buyLink,
      },
    });
  }
  console.log(`${MOCK_ISSUES.length} Issues seeded.`);

  // 7. Seed Ads
  console.log('Seeding Ads...');
  for (const ad of ADS) {
    await db.ad.create({
      data: {
        title: ad.title,
        image: ad.image,
        link: ad.link,
        active: ad.active
      }
    });
  }
  console.log(`${ADS.length} Ads seeded.`);

  console.log(`Seeding finished successfully.`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });