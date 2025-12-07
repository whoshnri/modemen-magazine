'use client';

import { deleteSubscriber } from "@/app/actions/cms/newsletter";
import { useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";

export function DeleteSubscriberButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this subscriber? This cannot be undone.')) return;

        startTransition(async () => {
            const result = await deleteSubscriber(id);
            if (result.error) {
                showToast(result.error, 'error');
            } else {
                showToast('Subscriber deleted successfully', 'success');
            }
        });
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
        >
            {isPending ? '...' : 'Remove'}
        </button>
    )
}
