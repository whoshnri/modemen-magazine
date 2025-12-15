'use client';

import { updateOrderStatus } from "@/app/actions/cms/orders";
// import { OrderStatus } from "@/lib/generated/prisma/client";

const OrderStatus = {
    PAID: "PAID",
    PENDING: "PENDING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELED: "CANCELED",
} as const;

type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

import { useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";

export function StatusSelect({ id, currentStatus }: { id: string, currentStatus: OrderStatus }) {
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as OrderStatus;

        startTransition(async () => {
            const result = await updateOrderStatus(id, newStatus);
            if (result.error) {
                showToast(result.error, 'error');
            } else {
                showToast('Order status updated', 'success');
            }
        });
    }

    return (
        <div className="relative">
            <select
                value={currentStatus}
                onChange={handleChange}
                disabled={isPending}
                className="appearance-none bg-[#050505] border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 pr-8 focus:outline-none focus:border-gold-primary transition-colors disabled:opacity-50"
            >
                {Object.values(OrderStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
        </div>
    )
}
