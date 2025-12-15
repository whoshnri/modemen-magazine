"use client";

import { createSponsored } from "@/app/actions/cms/sponsored";
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
            {pending ? "CREATING..." : "CREATE CAMPAIGN"}
        </button>
    );
}

export default function NewSponsoredPage() {
    const { showToast } = useToast();
    const router = useRouter();

    async function clientAction(formData: FormData) {
        const result = await createSponsored(formData);
        if (result.success) {
            showToast("Campaign created successfully", "success");
            router.push("/cms/sponsored");
        } else {
            showToast(result.error || "Failed to create campaign", "error");
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">NEW CAMPAIGN</h2>
                <Link
                    href="/cms/sponsored"
                    className="text-xs font-bold tracking-widest text-muted-foreground hover:text-white transition-colors uppercase"
                >
                    ← Back to List
                </Link>
            </div>

            <form action={clientAction} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Campaign Title</label>
                            <input type="text" name="title" required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Slug</label>
                            <input type="text" name="slug" required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Client Name</label>
                            <input type="text" name="client" required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="e.g. Rolex" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Image URL</label>
                            <input type="url" name="imageUrl" required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Link URL</label>
                            <input type="url" name="link" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Date</label>
                            <input type="date" name="date" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none [color-scheme:dark]" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Description</label>
                    <textarea name="description" rows={6} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none" />
                </div>

                <div className="pt-4 border-t border-white/10">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
