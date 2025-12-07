'use client';

import { deleteArticle } from "@/app/actions/cms/articles";
import { useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";

export function DeleteArticleButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        startTransition(async () => {
            const result = await deleteArticle(id);
            if (result.error) {
                showToast(result.error, 'error');
            } else {
                showToast('Article deleted successfully', 'success');
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
