// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  const fashionCategory = await db.category.create({
    data: { name: 'Fashion', description: 'Timeless apparel.' },
  });

  const groomingCategory = await db.category.create({
    data: { name: 'Grooming', description: 'Essentials for the modern gentleman.' },
  });

  await db.product.create({
    data: {
      name: 'Bespoke Leather Wallet',
      price: 150.00,
      stock: 25,
      image: '/images/products/wallet.jpg', // Use placeholder paths
      categories: {
        connect: { id: fashionCategory.id }
      }
    },
  });

  await db.product.create({
    data: {
      name: 'Oud & Cedarwood Cologne',
      price: 220.00,
      stock: 15,
      image: '/images/products/cologne.jpg',
      categories: {
        connect: { id: groomingCategory.id }
      }
    },
  });

   await db.product.create({
    data: {
      name: 'Silk Tie',
      price: 85.00,
      stock: 50,
      image: '/images/products/tie.jpg',
      categories: {
        connect: [{ id: fashionCategory.id }]
      }
    },
  });

  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })