"use server";

import prisma from "@/lib/prisma";
import { EventType } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function getEvents() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: "desc" },
        });
        return { success: true, data: events };
    } catch (error) {
        console.error("Error fetching events:", error);
        return { success: false, error: "Failed to fetch events" };
    }
}

export async function getEventById(id: string) {
    try {
        return await prisma.event.findUnique({ where: { id } });
    } catch (error) {
        console.error("Error fetching event:", error);
        return null;
    }
}

export async function createEvent(formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const location = formData.get("location") as string;
    const type = formData.get("type") as EventType;
    const ticketLink = formData.get("ticketLink") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const featured = formData.get("featured") === "on";

    if (!title || !slug || !description || !dateStr) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        await prisma.event.create({
            data: {
                title,
                slug,
                description,
                date: new Date(dateStr),
                location,
                type,
                ticketLink,
                imageUrl,
                featured,
            },
        });
        revalidatePath("/cms/events");
        revalidatePath("/events");
        return { success: true };
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false, error: "Failed to create event" };
    }
}

export async function updateEvent(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const location = formData.get("location") as string;
    const type = formData.get("type") as EventType;
    const ticketLink = formData.get("ticketLink") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const featured = formData.get("featured") === "on";

    try {
        await prisma.event.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                date: new Date(dateStr),
                location,
                type,
                ticketLink,
                imageUrl,
                featured,
            },
        });
        revalidatePath("/cms/events");
        revalidatePath("/events");
        revalidatePath(`/events/${slug}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating event:", error);
        return { success: false, error: "Failed to update event" };
    }
}

export async function deleteEvent(id: string) {
    try {
        await prisma.event.delete({ where: { id } });
        revalidatePath("/cms/events");
        revalidatePath("/events");
        return { success: true };
    } catch (error) {
        console.error("Error deleting event:", error);
        return { success: false, error: "Failed to delete event" };
    }
}
