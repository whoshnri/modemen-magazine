'use server';

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getUsers(page = 1, search = "") {
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            { email: { contains: search } },
            { name: { contains: search } },
        ]
    } : {};

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { role: 'asc' }, // Admins first (since 'A' < 'U')
        }),
        prisma.user.count({ where })
    ]);

    return { users, total, pages: Math.ceil(total / limit) };
}

export async function updateUserRole(userId: string, role: Role) {
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role }
        });
        revalidatePath('/cms/settings');
        return { success: true, user };
    } catch (error) {
        console.error("Update user role error:", error);
        return { error: "Failed to update user role" };
    }
}
