"use server"
import prisma from "@/lib/prisma"


export async function getFeaturedEvents(offset: number = 0) {
    try {
        const events = await prisma.event.findMany({
            where: {
                featured: true,
            },
            skip: offset,
            take: 3,
        })
        return events
    } catch (error) {
        return null
    }
}


export async function getEvent(slug: string) {
    try {
        const event = await prisma.event.findUnique({
            where: {
                slug
            },
        })
        return event
    } catch (error) {
        return null
    }
}



export async function getMoreEvents(offset: number = 0, slug: string) {
    try {
        const events = await prisma.event.findMany({
            where: {
                slug: {
                    not: slug
                }
            },
            take: 10,
            skip: offset
        })
        return events
    } catch (error) {
        return null
    }
}

export async function getEvents(offset: number = 0) {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                date: "asc"
            },
            take: 10,
            skip: offset
        });
        return events;
    } catch (error) {
        return null;
    }
}
