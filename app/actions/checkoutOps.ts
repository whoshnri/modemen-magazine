"use server"
import prisma from "@/lib/prisma";
import { getCart } from "./storeOperations";

export async function normaliseOnsuccess(reference: string, id: string, retries: number = 3) {
    if (retries < 0) {
        return {
            message: "Failed to update Order after multiple retries", status: false
        };
    }
    const cart = await getCart()

    try {
        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: { id },
                data: {
                    paid: true,
                    reference: reference,
                    status: "PAID"
                }
            });

            if (cart) {
                await tx.cart.delete({
                    where: { id: cart.id }
                })
            }

            if (order.discountId) {
                const couponInvalidationResult = await tx.discount.update({
                    where: { id: order.discountId },
                    data: { isActive: false },
                });
                if (!couponInvalidationResult) {
                    throw new Error("Failed to invalidate coupon");
                }
            }
            return order;
        });

        return {
            message: "Updated Order", status: true
        };
    } catch (err: any) {
        console.error("Transaction failed:", err);
        return await normaliseOnsuccess(reference, id, retries - 1);
    }
}

