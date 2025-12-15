"use server"
import prisma from "@/lib/prisma"
import { Metadata } from "next"

export async function getMetadataForArticles(slug: string): Promise<Metadata> {
    try {
        const article = await prisma.article.findUnique({
            where: {
                slug
            },
            select: {
                title: true,
                slug: true,
                publicationDate: true,
                bannerImage: true,
                writtenBy: true,
                category: true,
                subcategory: true
            }
        })

        if (!article) {
            return {
                title: "Article Not Found | Mode Men",
                description: "The article you are looking for does not exist."
            }
        }

        const keywords = [article.category, article.subcategory];

        return {
            title: `${article.title} | Mode Men`,
            description: `Read ${article.title} by ${article.writtenBy} on Mode Men Magazine.`,
            openGraph: {
                title: article.title,
                description: `Read ${article.title} by ${article.writtenBy} on Mode Men Magazine.`,
                url: `https://modemenmag.com/articles/read/${article.slug}`,
                siteName: "Mode Men Magazine",
                images: article.bannerImage ? [{ url: article.bannerImage }] : [],
                locale: "en_US",
                type: "article",
                publishedTime: article.publicationDate.toISOString(),
                authors: [article.writtenBy],
                tags: keywords
            },
            twitter: {
                card: "summary_large_image",
                title: article.title,
                description: `Read ${article.title} on Mode Men.`,
                images: article.bannerImage ? [article.bannerImage] : [],
            }
        }

    } catch (e) {
        console.error("Error fetching metadata", e)
        return {
            title: "Mode Men Magazine",
            description: "African Luxury, Style & Culture"
        }
    }
}