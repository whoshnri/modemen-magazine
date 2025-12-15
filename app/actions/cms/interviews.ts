"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInterviews() {
    try {
        const interviews = await prisma.interview.findMany({
            orderBy: { publishedAt: "desc" },
        });
        return { success: true, data: interviews };
    } catch (error) {
        console.error("Error fetching interviews:", error);
        return { success: false, error: "Failed to fetch interviews" };
    }
}

export async function getFeaturedInterviews() {
    try {
        const interviews = await prisma.interview.findMany({
            where: { featured: true },
            orderBy: { publishedAt: "desc" },
            take: 4,
        });
        return { success: true, data: interviews };
    } catch (error) {
        console.error("Error fetching featured interviews:", error);
        return { success: false, error: "Failed to fetch featured interviews" };
    }
}

export async function getInterviewById(id: string) {
    try {
        return await prisma.interview.findUnique({ where: { id } });
    } catch (error) {
        console.error("Error fetching interview:", error);
        return null;
    }
}

export async function createInterview(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const coverImage = formData.get("coverImage") as string;
    const people = formData.get("people") as string;
    const tagline = formData.get("tagline") as string;
    const featured = formData.get("featured") === "on";

    if (!title || !slug || !content) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        await prisma.interview.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                videoUrl,
                coverImage,
                people,
                tagline,
                featured,
            },
        });
        revalidatePath("/cms/interviews");
        revalidatePath("/interviews");
        return { success: true };
    } catch (error) {
        console.error("Error creating interview:", error);
        return { success: false, error: "Failed to create interview" };
    }
}

export async function updateInterview(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const coverImage = formData.get("coverImage") as string;
    const people = formData.get("people") as string;
    const tagline = formData.get("tagline") as string;
    const featured = formData.get("featured") === "on";

    try {
        await prisma.interview.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                excerpt,
                videoUrl,
                coverImage,
                people,
                tagline,
                featured,
            },
        });
        revalidatePath("/cms/interviews");
        revalidatePath("/interviews");
        revalidatePath(`/interviews/${slug}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating interview:", error);
        return { success: false, error: "Failed to update interview" };
    }
}

export async function deleteInterview(id: string) {
    try {
        await prisma.interview.delete({ where: { id } });
        revalidatePath("/cms/interviews");
        revalidatePath("/interviews");
        return { success: true };
    } catch (error) {
        console.error("Error deleting interview:", error);
        return { success: false, error: "Failed to delete interview" };
    }
}
