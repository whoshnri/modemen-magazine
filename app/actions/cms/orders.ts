'use server';

import prisma from "@/lib/prisma";
import { OrderStatus } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function getOrders(page = 1, search = "") {
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            { orderId: { contains: search } },
            { user: { email: { contains: search } } },
            { user: { name: { contains: search } } },
            { reference: { contains: search } }
        ]
    } : {};

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } },
                shippingAddress: true,
                billingAddress: true,
            }
        }),
        prisma.order.count({ where })
    ]);

    return { orders, total, pages: Math.ceil(total / limit) };
}

export async function getAllOrdersForExport() {
    // Fetch all orders for export (careful with large datasets, but fine for generic CMS use case)
    return prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true } },
            items: true,
            shippingAddress: true,
        }
    });
}

export async function getOrderById(id: string) {
    return prisma.order.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, email: true } },
            items: { include: { product: true } },
            shippingAddress: true,
            billingAddress: true,
        }
    });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/cms/orders');
        revalidatePath(`/cms/orders/${id}`);
        return { success: true, order };
    } catch (error) {
        console.error("Update order status error:", error);
        return { error: "Failed to update order status" };
    }
}
