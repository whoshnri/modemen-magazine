"use server";

import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { $Enums, Article } from "@/lib/generated/prisma/client";

// Helper type for articles until general type is fixed


// Helper to normalize strings to Enum keys (e.g. "business-money" -> "BUSINESS_AND_MONEY")
function normalizeEnumKey(key: string): string {
  return key.toUpperCase().replace(/-/g, "_");
}

export const fetchSpecArticles = unstable_cache(
  async (categorySlug: string, offset: number, subcategorySlug?: string) => {
    try {
      // Normalize Category
      const normalizedCategory = normalizeEnumKey(categorySlug);
      // Validate against Enum (optional but good safety)
      const category = Object.values($Enums.Tag).find(t => t === normalizedCategory);

      if (!category) {
        console.warn(`Invalid category: ${categorySlug} -> ${normalizedCategory}`);
        return { message: "Invalid category", data: [] };
      }

      // Normalize Subcategory if present
      let subcategory: $Enums.SubTags | undefined;
      if (subcategorySlug) {
        const normalizedSub = normalizeEnumKey(subcategorySlug);
        subcategory = Object.values($Enums.SubTags).find(t => t === normalizedSub);
        if (!subcategory) {
          console.warn(`Invalid subcategory: ${subcategorySlug} -> ${normalizedSub}`);
          // We fetch strictly by category if subcategory is invalid? Or return empty?
          // Let's filter strictly: if user asks for specific sub and it doesn't exist, return empty.
          // Actually, user might mistype. Let's return empty to be correct.
          return { message: "Invalid subcategory", data: [] };
        }
      }

      const articles = await prisma.article.findMany({
        where: {
          category: category,
          subcategory: subcategory, // Prisma ignores undefined
        },
        take: 9,
        skip: offset,
        orderBy: {
          publicationDate: 'desc'
        }
      });

      if (!articles) {
        return { message: "No articles found", data: [] };
      } else {
        return { message: "Articles fetched successfully", data: articles };
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      return { message: "Error fetching articles", data: [] };
    }
  }, ['articles', 'spec'], { revalidate: 3600, tags: ['articles'] });


export const fetchAllArticles = unstable_cache(
  async (
    offset: number = 0,
    limit: number = 20,
    search?: string,
    category: $Enums.Tag | "All" = "All",
  ) => {
    try {
      const articles = await prisma.article.findMany({
        where: {
          category: category !== "All" ? category : undefined,
          title: search ? {
            contains: search,
          } : undefined,
        },
        skip: offset,
        take: limit,
        orderBy: {
          publicationDate: 'desc',
        },
      });

      return { data: articles };
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      return { error: "Could not fetch articles." };
    }
  }, ['articles', 'all'], { revalidate: 172800, tags: ['articles'] });

export const getArticleBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const article = await prisma.article.findUnique({
        where: { slug },
      });
      if (!article) {
        return { message: "Article not found", data: null };
      } else {
        return { message: "Article fetched successfully", data: article };
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      return { message: "Error fetching article", data: null };
    }
  }, ['articles', 'slug'], { revalidate: 172800, tags: ['articles'] });


export const getRelatedArticles = unstable_cache(
  async (category: $Enums.Tag, offset: number) => {
    try {
      const article = await prisma.article.findMany({
        where: {
          category: category
        },
        take: 5,
        skip: offset,
      })
      if (!article) {
        return { message: "No related articles found", data: [] };
      } else {
        return { message: "Related articles fetched successfully", data: article };
      }
    } catch (error) {
      console.error("Error fetching related articles:", error);
      return { message: "Error fetching related articles", data: [] };
    }
  }, ['articles', 'related'], { revalidate: 172800, tags: ['articles'] });

const tags = ["STYLE", "CULTURE", "BUSINESS_AND_MONEY"] as const;

export const fetchHomePageArticles = unstable_cache(
  async () => {
    try {
      // Fetch top 5 featured articles
      const featuredArticles = await prisma.article.findMany({
        where: {
          featured: true
        },
        take: 5,
        orderBy: {
          publicationDate: 'desc'
        }
      });

      const articlesByTagPromises = tags.map(tag =>
        prisma.article.findMany({
          where: {
            category: tag
          },
          take: 5,
          orderBy: {
            publicationDate: 'desc'
          }
        })
      );

      const results = await Promise.all(articlesByTagPromises);

      const featuredArticlesByTag: { [key: string]: Article[] } = {};
      tags.forEach((tag, index) => {
        featuredArticlesByTag[tag] = results[index];
      });
      return {
        message: "Home page articles fetched successfully",
        data: { featuredArticles, featuredArticlesByTag }
      };
    } catch (error) {
      console.error("Error fetching home page articles:", error);
      return { message: "Error fetching home page articles", data: null }; // Should handle null better in UI
    }
  }, ['articles', 'home'], { revalidate: 172800, tags: ['articles'] });


export async function loadMoreArticles(offset:number) {
  
  try{
    const featuredArticles = await prisma.article.findMany({
        where: {
          featured: true
        },
        take: 5,
        orderBy: {
          publicationDate: 'desc'
        },
        skip: offset
      });
      return {
        message: "Home page articles fetched successfully",
        data: featuredArticles 
      };
  }catch(error){
    console.error("Error fetching home page articles:", error);
    return { message: "Error fetching home page articles", data: null }; // Should handle null better in UI
  }
}