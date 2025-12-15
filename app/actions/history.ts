"use server";

import { cookies } from "next/headers";

export async function addToReadingHistory(article: { title: string; slug: string; category: string }) {
    const cookieStore = await cookies();
    const historyCookie = cookieStore.get("reading_history");

    let history: any[] = [];

    if (historyCookie) {
        try {
            history = JSON.parse(historyCookie.value);
        } catch (e) {
            console.error("Failed to parse history cookie", e);
        }
    }

    // Remove duplicate if exists
    history = history.filter((item) => item.slug !== article.slug);

    // Add new item to front
    history.unshift({
        ...article,
        readAt: new Date().toISOString()
    });

    // Limit to 10 items
    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    cookieStore.set("reading_history", JSON.stringify(history), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
}
