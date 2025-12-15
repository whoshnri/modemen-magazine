"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getIssues() {
    try {
        const issues = await prisma.issues.findMany({
            orderBy: { releaseDate: "desc" }, // Updated to sort by releaseDate
        });
        return { success: true, data: issues };
    } catch (error) {
        console.error("Error fetching issues:", error);
        return { success: false, error: "Failed to fetch issues" };
    }
}

export async function getIssueById(id: string) {
    try {
        return await prisma.issues.findUnique({
            where: { id },
        });
    } catch (error) {
        console.error("Error fetching issue:", error);
        return null;
    }
}

export async function getLatestIssue() {
    try {
        return await prisma.issues.findFirst({
            orderBy: { releaseDate: "desc" },
        });
    } catch (error) {
        console.error("Error fetching latest issue:", error);
        return null;
    }
}

export async function createIssue(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const teaserText = formData.get("teaserText") as string;
    const coverImage = formData.get("coverImage") as string;
    const viewLink = formData.get("viewLink") as string;
    const buyLink = formData.get("buyLink") as string;

    if (!title || !viewLink || !coverImage) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        await prisma.issues.create({
            data: {
                title,
                description,
                teaserText,
                coverImage,
                viewLink,
                buyLink,
                releaseDate: new Date(),
            },
        });
        revalidatePath("/cms/issues");
        revalidatePath("/issues");
        return { success: true };
    } catch (error) {
        console.error("Error creating issue:", error);
        return { success: false, error: "Failed to create issue" };
    }
}

export async function updateIssue(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const teaserText = formData.get("teaserText") as string;
    const coverImage = formData.get("coverImage") as string;
    const viewLink = formData.get("viewLink") as string;
    const buyLink = formData.get("buyLink") as string;

    try {
        await prisma.issues.update({
            where: { id },
            data: {
                title,
                description,
                teaserText,
                coverImage,
                viewLink,
                buyLink
            },
        });
        revalidatePath("/cms/issues");
        revalidatePath("/issues");
        return { success: true };
    } catch (error) {
        console.error("Error updating issue:", error);
        return { success: false, error: "Failed to update issue" };
    }
}

export async function deleteIssue(id: string) {
    try {
        await prisma.issues.delete({ where: { id } });
        revalidatePath("/cms/issues");
        revalidatePath("/issues");
        return { success: true };
    } catch (error) {
        console.error("Error deleting issue:", error);
        return { success: false, error: "Failed to delete issue" };
    }
}
