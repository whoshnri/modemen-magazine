"use server";
import { $Enums, PrismaClient } from "@prisma/client";
import data from "@/data.json";
import prisma from "@/lib/prisma";
async function main() {
  const logs = [];

  for (const article of data) {
    const slug = article?.title
      ?.replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase() ?? "unknown";
    if(!article?.title || !article?.metadata || !article?.body) {
      console.error(`skipping article due to missing data: ${article?.title ?? "UNKNOWN"}\n\n`);
      logs.push(`skipping article due to missing data: ${article?.title ?? "UNKNOWN"}\n\n`);
      continue;
    }

    try {
      await prisma.article.create({
        data: {
          slug,
          title: article.title,
          writtenBy: article.metadata.writtenBy,
          publicationDate: new Date(article.metadata.publicationDate),
          tags: {
            createMany: {
              data: article.metadata.tags.map((tag: string) => ({
                id: `tag-${tag}-${slug}-${new Date().toISOString()}`,
                name: tag as $Enums.Tag,
              })),
            },
          },
          body: article.body,
        },
      });

      console.log(`created article: ${article.title}`);
      logs.push(`created article: ${article.title}`);
    } catch (error: any) {
      console.error(`error creating article: ${article?.title ?? "UNKNOWN"} - ${error.message}`);
      logs.push(`error creating article: ${article?.title ?? "UNKNOWN"} - ${error.message}`);
    }
  }

  return logs;
}


async function createStoreItem(){
  const data =  {
    id: '410',
    name: 'Cashmere Wool Blend Coat',
    price: 1200,
    image: '/cashmere-wool-coat.jpg',
    description: 'Italian tailored elegance in premium fibers',
    category: 'Apparel',
    featured: false
  }

  const data2 = await prisma.product.create({
    data: {
      id: data.id,
      name: data.name,
      price: data.price,
      image: data.image,
      categories : {
        connectOrCreate: {
          where: { name: data.category },
          create: { name: data.category },
        }
      },
    }
  });
  if(data2){
    console.log('Created product:', data2);
    return `Created product: ${data2.name}`;
  } else {
    console.log('Failed to create product');
    return 'Failed to create product';
  }
}


// one time only
export async function runMainCreate() {
  const logs = await createStoreItem();
}
