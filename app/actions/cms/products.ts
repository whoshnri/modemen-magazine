'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ProductData = {
    name: string;
    price: number;
    desc?: string;
    stock: number;
    image: string;
    categoryIds: string[]; // List of Category IDs to connect
};

export async function getProducts(page = 1, search = "") {
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            { name: { contains: search } },
            { desc: { contains: search } },
        ]
    } : {};

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
            include: { categories: true }
        }),
        prisma.product.count({ where })
    ]);

    return { products, total, pages: Math.ceil(total / limit) };
}

export async function getProductById(id: string) {
    return prisma.product.findUnique({
        where: { id },
        include: { categories: true }
    });
}

export async function getAllCategories() {
    return prisma.category.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function createProduct(data: ProductData) {
    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                price: Number(data.price),
                desc: data.desc,
                stock: Number(data.stock),
                image: data.image,
                categories: {
                    connect: data.categoryIds.map(id => ({ id }))
                }
            }
        });
        revalidatePath('/cms/products');
        revalidatePath('/store');
        return { success: true, product };
    } catch (error) {
        console.error("Create product error:", error);
        return { error: "Failed to create product" };
    }
}

export async function updateProduct(id: string, data: ProductData) {
    try {
        // Disconnect all categories first to reset, then connect new ones
        // A standard approach for update replace relation

        // Actually simpler to just set the new list of connections if we want to REPLACE
        // prisma update 'set' only works for single relations sometimes, for m-n 'set' is valid in recent prisma

        const product = await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                price: Number(data.price),
                desc: data.desc,
                stock: Number(data.stock),
                image: data.image,
                categories: {
                    set: [], // Clear all
                    connect: data.categoryIds.map(id => ({ id }))
                }
            }
        });
        revalidatePath('/cms/products');
        revalidatePath('/store');
        return { success: true, product };
    } catch (error) {
        console.error("Update product error:", error);
        return { error: "Failed to update product" };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath('/cms/products');
        return { success: true };
    } catch (error) {
        console.error("Delete product error:", error);
        return { error: "Failed to delete product" };
    }
}
