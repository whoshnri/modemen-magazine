"use client";

import { createIssue } from "@/app/actions/cms/issues";
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
            {pending ? "CREATING..." : "CREATE ISSUE"}
        </button>
    );
}

export default function NewIssuePage() {
    const { showToast } = useToast();
    const router = useRouter();

    async function clientAction(formData: FormData) {
        const result = await createIssue(formData);
        if (result.success) {
            showToast("Issue created successfully", "success");
            router.push("/cms/issues");
        } else {
            showToast(result.error || "Failed to create issue", "error");
        }
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">NEW ISSUE</h2>
                <Link
                    href="/cms/issues"
                    className="text-xs font-bold tracking-widest text-muted-foreground hover:text-white transition-colors uppercase"
                >
                    ← Back to List
                </Link>
            </div>

            <form action={clientAction} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Issue Title</label>
                    <input type="text" name="title" required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="e.g. The Style Issue" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Cover Image URL</label>
                    <input type="url" name="coverImage" required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="https://..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Read Link</label>
                        <input type="url" name="viewLink" required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Buy Link (Optional)</label>
                        <input type="url" name="buyLink" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="https://..." />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Teaser Text (Short)</label>
                    <input type="text" name="teaserText" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="Brief tagline..." />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Description (Full)</label>
                    <textarea name="description" rows={5} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none" />
                </div>

                <div className="pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
