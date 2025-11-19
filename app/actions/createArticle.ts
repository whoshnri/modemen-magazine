"use server";
import { $Enums, PrismaClient } from "@prisma/client";
import data from "@/data.json";
import prisma from "@/lib/prisma";

async function main() {
  const logs = [];
  for (const article of data) {
    const slug = `${article.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
    try {
      const data = await prisma.article.create({
        data: {
          // replace weird non URL-safe characters in title with hyphens and make lowercase
          slug,
          title: article.title,
          writtenBy: article.metadata.writtenBy,
          publicationDate: new Date(article.metadata.publicationDate),
          tags: {
            createMany: {
              data: article.metadata.tags.map((tag: string) => ({
                id: `tag-${tag}-${slug}-${Date.now().toLocaleString()}`,
                name: tag as $Enums.Tag,
              })),
            },
          },
          body: article.body,
        },
      });
      console.log("created article: " + article.title);
      logs.push("created article: " + article.title);
    } catch (error) {
      console.error("error creating article: " + article.title + " " + error);
      logs.push("error creating article: " + article.title + " " + error);
    }
  }
  return logs;
}

// one time only
export async function runMainCreate() {
  const logs = await main();
  console.dir("");
  console.dir("");

  console.dir("");
  console.dir("");
}
