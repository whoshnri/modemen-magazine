"use server";

import prisma from "@/lib/prisma";
import { $Enums } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function getUsers(page: number = 1, search: string = "") {
    try {
        const pageSize = 20;
        const skip = (page - 1) * pageSize;

        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { email: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {};

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: pageSize,
            }),
            prisma.user.count({ where })
        ]);

        const pages = Math.ceil(total / pageSize);

        return {
            success: true,
            data: users,
            meta: {
                total,
                pages,
                page
            }
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function getUserById(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                orders: true,
                addresses: true,
                newsletterSubscription: true,
            },
        });
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function updateUserRole(userId: string, role: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: role as $Enums.Role },
        });
        revalidatePath("/cms/users");
        revalidatePath("/cms/settings");
        return { success: true };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, error: "Failed to update user role" };
    }
}

export async function updateUserSubscription(userId: string, plan: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { subscriptionPlan: plan as $Enums.SubscriptionPlan },
        });
        revalidatePath("/cms/users");
        revalidatePath("/cms/settings");
        return { success: true };
    } catch (error) {
        console.error("Error updating user subscription:", error);
        return { success: false, error: "Failed to update user subscription" };
    }
}
