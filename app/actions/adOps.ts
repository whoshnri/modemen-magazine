"use server";
import prisma from "@/lib/prisma";
import { Tag } from "@/lib/generated/prisma/client";

export async function getRandomAdByType(tags: Tag | Tag[], count: number = 10) {
    try {
        const queryTags = Array.isArray(tags) ? tags : [tags];

        const ads = await prisma.ad.findMany({
            where: {
                active: true,
                type: {
                    hasSome: queryTags
                }
            },
        });

        // If no specific ads found, fallback to general ads or return fewer
        if (ads.length === 0) {
            const fallbackAds = await prisma.ad.findMany({
                where: { active: true },
                take: count
            });
            // If even fallback is empty, validly return empty
            return fallbackAds;
        }

        // Randomize and fill
        const selectedAds: typeof ads = [];
        for (let i = 0; i < count; i++) {
            if (ads.length > 0) {
                const randomIndex = Math.floor(Math.random() * ads.length);
                selectedAds.push(ads[randomIndex]);
            }
        }

        return selectedAds;

    } catch (error) {
        console.error("Error fetching random ad by type:", error);
        return [];
    }
}

export async function getRandomAd() {
    try {
        const ads = await prisma.ad.findMany({
            where: { active: true },
        });

        if (ads.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * ads.length);
        return ads[randomIndex];
    } catch (error) {
        console.error("Error fetching random ad:", error);
        return null;
    }
}

export async function createAd(data: { title: string; image: string; link: string; type: Tag[] }) {
    try {
        await prisma.ad.create({
            data: {
                ...data,
                active: true,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating ad:", error);
        return { success: false };
    }
}

export async function deleteAd(id: string) {
    try {
        await prisma.ad.delete({
            where: { id },
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting ad:", error);
        return { success: false };
    }
}

export async function getAds() {
    try {
        return await prisma.ad.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching ads:", error);
        return [];
    }
}
