"use client";

import { createCategory } from "@/app/actions/cms/categories";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useToast } from "@/components/toast/use-toast";
import { useRouter } from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-gold-primary text-black-primary font-bold py-4 px-8 tracking-widest text-xs hover:bg-gold-secondary disabled:bg-gray-600 w-full md:w-auto"
        >
            {pending ? "CREATING..." : "CREATE CATEGORY"}
        </button>
    );
}

export default function NewCategoryPage() {
    const { showToast } = useToast();
    const router = useRouter();

    async function clientAction(formData: FormData) {
        const result = await createCategory(formData);
        if (result.success) {
            showToast("Category created successfully", "success");
            router.push("/cms/categories");
        } else {
            showToast(result.error || "Failed to create category", "error");
        }
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">NEW CATEGORY</h2>
                <Link
                    href="/cms/categories"
                    className="text-xs font-bold tracking-widest text-muted-foreground hover:text-white transition-colors uppercase"
                >
                    ← Back to List
                </Link>
            </div>

            <form action={clientAction} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold tracking-widest text-gold-primary uppercase">
                        Category Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none"
                        placeholder="e.g. WATCHES"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-xs font-bold tracking-widest text-gold-primary uppercase">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={4}
                        className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none"
                        placeholder="Optional description..."
                    />
                </div>

                <div className="pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
