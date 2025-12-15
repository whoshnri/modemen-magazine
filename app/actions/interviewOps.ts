"use server"
import prisma from "@/lib/prisma"


export async function getInterViews() {
    try {
        const interviews = await prisma.interview.findMany()
        return interviews
    } catch (error) {
        return null
    }
}


export async function getSpecificInterview(slug: string) {
    try {
        const interview = await prisma.interview.findUnique({
            where: {
                slug: slug
            }
        })
        return interview
    } catch (error) {
        return null
    }
}

export async function loadMoreInterviews(slug: string, offset: number) {
    try {
        const interviews = await prisma.interview.findMany({
            where: {
                NOT: {
                    slug
                }
            },
            skip: offset,
            take: 10
        })
        return interviews
    } catch (error) {
        return null
    }
}