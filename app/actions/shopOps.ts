"use server";

import prisma from "@/lib/prisma";

export async function fetchProductsByCategory(categoryName: string, offset: number = 0, limit: number = 4) {
    try {
        // Normalize category name to match potential DB entries (e.g., "Men's Fashion" -> "Mens Fashion" or exact match)
        // For now, we assume precise matching, but we'll try to be flexible if the user input varies.
        // Ideally, we'd search by Slug or Enum, but string matching is fine for now given the prompt.

        // Check if category exists first
        const category = await prisma.category.findFirst({
            where: {
                name: {
                    equals: categoryName,
                }
            }
        });

        if (!category) {
            // Graceful handling: return empty if category not found
            return { data: [], hasMore: false };
        }

        const products = await prisma.product.findMany({
            where: {
                categories: {
                    some: {
                        id: category.id
                    }
                }
            },
            take: limit,
            skip: offset,
            orderBy: {
                id: 'desc' // Newest first?
            }
        });

        // Check if there are more
        const totalCount = await prisma.product.count({
            where: {
                categories: {
                    some: {
                        id: category.id
                    }
                }
            }
        });

        const hasMore = offset + products.length < totalCount;

        return { data: products, hasMore };
    } catch (error) {
        console.error(`Error fetching products for category ${categoryName}:`, error);
        // Graceful error handling - return empty
        return { data: [], hasMore: false };
    }
}
