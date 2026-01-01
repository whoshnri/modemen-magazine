"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upgradeUserToPremium(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionPlan: "PREMIUM",
            },
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error upgrading user:", error);
        return { success: false, error: "Failed to upgrade user" };
    }
}
