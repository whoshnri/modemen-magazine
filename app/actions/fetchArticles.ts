"use server";

import prisma from "@/lib/prisma";
import { $Enums,Tag, Article } from "@prisma/client";
import { ArticleWithTags } from "../articles/[category]/page";

export async function fetchSpecArticles(type: $Enums.Tag, offset: number) {
    try{
  const articles = await prisma.article.findMany({
    where: {
      tags: {
        some: { name: type },
      },
      
    },
    include: {
      tags: true,
    },
    take: 9,
    skip: offset,
  });
    if(!articles){
      return {message : "No articles found", data : [] };
    }else{
        return { message : "Articles fetched successfully", data : articles };
    }
  }catch(error){
    console.error("Error fetching articles:", error);
    return {message : "Error fetching articles", data : [] };
  }
}


export async function fetchAllArticles(
  offset: number = 0,
  limit : number = 20,
  search? : string,
  category : $Enums.Tag | "All" = "All",
) {
  try {
    const whereClause: any = {};



    const articles = await prisma.article.findMany({
      where: {
        tags: category !== "All" ? {
          some: { name: category },
        } : undefined,
        title: search ? {
          contains: search,
        } : undefined,
      },
      skip: offset,
      take: limit,
      orderBy: {
        publicationDate: 'desc',
      },
      include: {
        tags: {
          select: { name: true },
        },
      },
    });

    return { data: articles };
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return { error: "Could not fetch articles." };
  }
}

export async function getArticleBySlug(slug: string) {
  try{
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        tags: true,
      },
    }); 
    if(!article){
      return { message : "Article not found", data : null };
    }else{
        return { message : "Article fetched successfully", data : article };
    }
  }catch(error){
    console.error("Error fetching article:", error);
    return {message : "Error fetching article", data : null };
  }
}


export async function getRelatedArticles(category: $Enums.Tag[], offset: number) {
  try{
    const article = await prisma.article.findMany({
      where: { 
        tags: {
          some: { name: { in: category } }
        }
       },
      take : 5,
      skip : offset,
      include: {
        tags: true,
      }
    })
    if(!article){
      return {message : "No related articles found", data : [] };
    }else{
        return { message : "Related articles fetched successfully", data : article };
    }
  }catch(error){
    console.error("Error fetching related articles:", error);
    return {message : "Error fetching related articles", data : [] };
  }
}

const tags = ["POLITICS", "FASHION", "BUSINESS", "ENTERTAINMENT", "EVENTS", "HEALTH", "SPORTS", "LIFESTYLE", "MENS_INTEREST", "SELF_IMPROVEMENT"];

export async function fetchHomePageArticles() {
  try {
    // Fetch top 5 featured articles
    const featuredArticles = await prisma.article.findMany({
      where: {
        featured: true
      },
      take: 5,
      include: {
        tags: true
      }
    });

    const articlesByTagPromises = tags.map(tag =>
      prisma.article.findMany({
        where: {
          tags: {
            some: { name: tag as $Enums.Tag }
          }
        },
        take: 5,
        include: {
          tags: true
        },
        orderBy: {
          publicationDate: 'desc'
        }
      })
    );

  

    const results = await Promise.all(articlesByTagPromises);

    const featuredArticlesByTag: { [key: string]: ArticleWithTags[] } = {};
    tags.forEach((tag, index) => {
      featuredArticlesByTag[tag] = results[index];
    });

    return {
      message: "Home page articles fetched successfully",
      data: { featuredArticles, featuredArticlesByTag }
    };
  } catch (error) {
    console.error("Error fetching home page articles:", error);
    return { message: "Error fetching home page articles", data: null };
  }
}