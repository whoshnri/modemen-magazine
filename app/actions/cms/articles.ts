'use server';

import prisma from "@/lib/prisma";
import { Article, Tag } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ArticleData = {
    title: string;
    description?: string; // Schema doesnt have description, maybe use body excerpt?
    body: string;
    slug: string;
    bannerImage: string;
    featured: boolean;
    writtenBy: string;
    tags: Tag[];
};

export async function getArticles(page = 1, search = "") {
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            { title: { contains: search } },
            { writtenBy: { contains: search } },
        ]
    } : {};

    const [articles, total] = await Promise.all([
        prisma.article.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { tags: true }
        }),
        prisma.article.count({ where })
    ]);

    return { articles, total, pages: Math.ceil(total / limit) };
}

export async function getArticleBySlug(slug: string) {
    return prisma.article.findUnique({
        where: { slug },
        include: { tags: true }
    });
}

export async function createArticle(data: ArticleData) {
    try {
        const article = await prisma.article.create({
            data: {
                title: data.title,
                slug: data.slug,
                body: data.body,
                bannerImage: data.bannerImage,
                featured: data.featured,
                writtenBy: data.writtenBy,
                tags: {
                    create: data.tags.map(tag => ({ name: tag }))
                }
            }
        });
        revalidatePath('/cms/articles');
        revalidatePath('/'); // Home page might show new articles
        return { success: true, article };
    } catch (error) {
        console.error("Create article error:", error);
        return { error: "Failed to create article" };
    }
}

export async function updateArticle(id: string, data: ArticleData) {
    try {
        // Delete existing tags and create new ones is the simplest way for update
        await prisma.articleTag.deleteMany({ where: { articleId: id } });

        const article = await prisma.article.update({
            where: { id },
            data: {
                title: data.title,
                slug: data.slug,
                body: data.body,
                bannerImage: data.bannerImage,
                featured: data.featured,
                writtenBy: data.writtenBy,
                tags: {
                    create: data.tags.map(tag => ({ name: tag }))
                }
            }
        });
        revalidatePath('/cms/articles');
        revalidatePath('/');
        return { success: true, article };
    } catch (error) {
        console.error("Update article error:", error);
        return { error: "Failed to update article" };
    }
}

export async function deleteArticle(id: string) {
    try {
        await prisma.article.delete({ where: { id } });
        revalidatePath('/cms/articles');
        return { success: true };
    } catch (error) {
        console.error("Delete article error:", error);
        return { error: "Failed to delete article" };
    }
}
