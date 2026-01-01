"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(email: string, userId?: string) {
    if (!email || !email.includes("@")) {
        return { error: "Please provide a valid email address." };
    }

    try {
        // Check if duplicate
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (existingSubscriber) {
            // OPTIONAL: If current user matches existing email but isn't linked, link it.
            if (userId && !existingSubscriber.userId) {
                await prisma.newsletterSubscriber.update({
                    where: { email },
                    data: { userId }
                });
                return { success: "Subscription linked to your account!" };
            }

            return { error: "This email is already subscribed to our newsletter." };
        }

        // Create new subscriber
        await prisma.newsletterSubscriber.create({
            data: {
                email,
                userId: userId || null, // Optional link
                isSubscribed: true,
            },
        });

        revalidatePath("/"); // Revalidate if needed, though mostly visual
        return { success: "Thank you for subscribing to Mode Men!" };

    } catch (error) {
        console.error("Newsletter Subscription Error:", error);
        return { error: "Something went wrong. Please try again later." };
    }
}

export async function unsubscribeFromNewsletter(email: string) {
    try {
        await prisma.newsletterSubscriber.update({
            where: { email },
            data: { isSubscribed: false }
        });
        return { success: "You have been unsubscribed." };
    } catch (error) {
        return { error: "Failed to unsubscribe." };
    }
}

export async function updateNewsletterStatus(userId: string, isSubscribed: boolean) {
    try {
        // Check if subscription exists for user
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { userId },
        });

        if (existing) {
            await prisma.newsletterSubscriber.update({
                where: { userId },
                data: { isSubscribed },
            });
        } else {
            // If no subscription linked to userId, we need to create one or link to existing email
            // First get user email
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return { error: "User not found" };

            // Check if email already subscribed (but not linked)
            const emailSub = await prisma.newsletterSubscriber.findUnique({
                where: { email: user.email },
            });

            if (emailSub) {
                // Link it and update status
                await prisma.newsletterSubscriber.update({
                    where: { email: user.email },
                    data: { userId, isSubscribed },
                });
            } else {
                // Create new
                await prisma.newsletterSubscriber.create({
                    data: {
                        email: user.email,
                        userId,
                        isSubscribed,
                    },
                });
            }
        }
        revalidatePath("/profile");
        return { success: `Newsletter preferences updated.` };
    } catch (error) {
        console.error("Newsletter Update Error:", error);
        return { error: "Failed to update subscription settings." };
    }
}

export async function getSubscribers(page = 1, search = "") {
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = search ? {
        email: { contains: search }
    } : {};

    const [subscribers, total] = await Promise.all([
        prisma.newsletterSubscriber.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, subscriptionPlan: true } } }
        }),
        prisma.newsletterSubscriber.count({ where })
    ]);

    return { subscribers, total, pages: Math.ceil(total / limit) };
}

export async function getAllSubscribersForExport() {
    return prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
    });
}

export async function deleteSubscriber(id: string) {
    try {
        await prisma.newsletterSubscriber.delete({ where: { id } });
        revalidatePath('/cms/newsletter');
        return { success: true };
    } catch (error) {
        console.error("Delete subscriber error:", error);
        return { error: "Failed to delete subscriber" };
    }
}
