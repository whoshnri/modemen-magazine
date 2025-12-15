"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { products: true } } }
        });
        return { success: true, data: categories };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, error: "Failed to fetch categories" };
    }
}

export async function createCategory(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!name) return { success: false, error: "Name is required" };

    try {
        await prisma.category.create({
            data: {
                name,
                description,
            },
        });
        revalidatePath("/cms/categories");
        return { success: true };
    } catch (error) {
        console.error("Error creating category:", error);
        return { success: false, error: "Failed to create category" };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id },
        });
        revalidatePath("/cms/categories");
        return { success: true };
    } catch (error) {
        console.error("Error deleting category:", error);
        return { success: false, error: "Failed to delete category" };
    }
}
