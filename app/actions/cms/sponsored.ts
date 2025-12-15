"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSponsoredContent() {
    try {
        const sponsored = await prisma.sponsored.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, data: sponsored };
    } catch (error) {
        console.error("Error fetching sponsored content:", error);
        return { success: false, error: "Failed to fetch sponsored content" };
    }
}

export async function getSponsoredById(id: string) {
    try {
        return await prisma.sponsored.findUnique({ where: { id } });
    } catch (error) {
        console.error("Error fetching sponsored content:", error);
        return null;
    }
}

export async function createSponsored(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const client = formData.get("client") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const link = formData.get("link") as string;
    const dateStr = formData.get("date") as string;

    if (!title || !slug || !client || !imageUrl) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        await prisma.sponsored.create({
            data: {
                title,
                slug,
                client,
                description,
                image : imageUrl,
                link,
            },
        });
        revalidatePath("/cms/sponsored");
        revalidatePath("/sponsored");
        return { success: true };
    } catch (error) {
        console.error("Error creating sponsored content:", error);
        return { success: false, error: "Failed to create sponsored content" };
    }
}

export async function updateSponsored(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const client = formData.get("client") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const link = formData.get("link") as string;
    const dateStr = formData.get("date") as string;

    try {
        await prisma.sponsored.update({
            where: { id },
            data: {
                title,
                slug,
                client,
                description,
                image : imageUrl,
                link,
            },
        });
        revalidatePath("/cms/sponsored");
        revalidatePath("/sponsored");
        revalidatePath(`/sponsored/${slug}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating sponsored content:", error);
        return { success: false, error: "Failed to update sponsored content" };
    }
}

export async function deleteSponsored(id: string) {
    try {
        await prisma.sponsored.delete({ where: { id } });
        revalidatePath("/cms/sponsored");
        revalidatePath("/sponsored");
        return { success: true };
    } catch (error) {
        console.error("Error deleting sponsored content:", error);
        return { success: false, error: "Failed to delete sponsored content" };
    }
}
