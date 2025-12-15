"use client";

import { updateSponsored, deleteSponsored } from "@/app/actions/cms/sponsored";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";
import Link from "next/link";

export default function EditSponsoredClient({ item }: { item: any }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { showToast } = useToast();

    async function handleUpdate(formData: FormData) {
        const result = await updateSponsored(item.id, formData);
        if (result.success) {
            showToast("Campaign updated successfully", "success");
        } else {
            showToast(result.error || "Failed to update campaign", "error");
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this campaign?")) return;

        startTransition(async () => {
            const result = await deleteSponsored(item.id);
            if (result.success) {
                showToast("Campaign deleted", "success");
                router.push("/cms/sponsored");
            } else {
                showToast("Failed to delete campaign", "error");
            }
        });
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">EDIT CAMPAIGN</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="text-xs font-bold tracking-widest text-red-500 hover:text-red-400 transition-colors uppercase px-4"
                    >
                        {isPending ? "Deleting..." : "Delete Campaign"}
                    </button>
                    <Link
                        href="/cms/sponsored"
                        className="text-xs font-bold tracking-widest text-muted-foreground hover:text-white transition-colors uppercase"
                    >
                        ← Back to List
                    </Link>
                </div>
            </div>

            <form action={handleUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Campaign Title</label>
                            <input type="text" name="title" defaultValue={item.title} required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Slug</label>
                            <input type="text" name="slug" defaultValue={item.slug} required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Client Name</label>
                            <input type="text" name="client" defaultValue={item.client} required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Image URL</label>
                            <input type="url" name="imageUrl" defaultValue={item.imageUrl} required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Link URL</label>
                            <input type="url" name="link" defaultValue={item.link || ""} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Date</label>
                            <input type="date" name="date" defaultValue={new Date(item.date).toISOString().slice(0, 10)} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none [color-scheme:dark]" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Description</label>
                    <textarea name="description" defaultValue={item.description || ""} rows={6} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none" />
                </div>

                <div className="pt-4 border-t border-white/10">
                    <button
                        type="submit"
                        className="bg-gold-primary text-black-primary font-bold py-4 px-8 tracking-widest text-xs hover:bg-gold-secondary w-full md:w-auto"
                    >
                        SAVE CHANGES
                    </button>
                </div>
            </form>
        </div>
    );
}
