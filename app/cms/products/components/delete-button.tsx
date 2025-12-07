'use client';

import { deleteProduct } from "@/app/actions/cms/products";
import { useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";

export function DeleteProductButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        startTransition(async () => {
            const result = await deleteProduct(id);
            if (result.error) {
                showToast(result.error, 'error');
            } else {
                showToast('Product deleted successfully', 'success');
            }
        });
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
        >
            {isPending ? '...' : 'Delete'}
        </button>
    )
}
