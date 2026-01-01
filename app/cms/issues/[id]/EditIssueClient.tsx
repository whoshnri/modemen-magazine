"use client";

import { updateIssue, deleteIssue } from "@/app/actions/cms/issues";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { useToast } from "@/components/toast/use-toast";
import Link from "next/link";
import { ImageUploader } from "@/components/image-uploader";

export default function EditIssueClient({ issue }: { issue: any }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { showToast } = useToast();
    const [imageUrl, setImageUrl] = useState(issue.coverImage || "");

    async function handleUpdate(formData: FormData) {
        const result = await updateIssue(issue.id, formData);
        if (result.success) {
            showToast("Issue updated successfully", "success");
        } else {
            showToast(result.error || "Failed to update issue", "error");
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this issue?")) return;

        startTransition(async () => {
            const result = await deleteIssue(issue.id);
            if (result.success) {
                showToast("Issue deleted", "success");
                router.push("/cms/issues");
            } else {
                showToast("Failed to delete issue", "error");
            }
        });
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">EDIT ISSUE</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="text-xs font-bold tracking-widest text-red-500 hover:text-red-400 transition-colors uppercase px-4"
                    >
                        {isPending ? "Deleting..." : "Delete Issue"}
                    </button>
                    <Link
                        href="/cms/issues"
                        className="text-xs font-bold tracking-widest text-muted-foreground hover:text-white transition-colors uppercase"
                    >
                        ← Back to List
                    </Link>
                </div>
            </div>

            <form action={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Issue Title</label>
                    <input type="text" name="title" defaultValue={issue.title} required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Cover Image URL</label>
                    <div className="space-y-3">
                        {imageUrl && (
                            <div className="relative w-full h-40 bg-gray-900 rounded-lg overflow-hidden border border-white/10">
                                <img src={imageUrl} alt="Issue Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImageUrl("")}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/80 text-white p-1 rounded-full transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input
                                type="url"
                                name="coverImage"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                required
                                className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none"
                            />
                            <ImageUploader
                                onUploadComplete={(url) => setImageUrl(url)}
                                directory="issues"
                                trigger={
                                    <button type="button" className="px-4 bg-white/10 border border-white/10 hover:bg-white/20 transition-colors h-full flex items-center justify-center rounded-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Read Link</label>
                        <input type="url" name="viewLink" defaultValue={issue.viewLink} required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Buy Link (Optional)</label>
                        <input type="url" name="buyLink" defaultValue={issue.buyLink || ""} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Teaser Text (Short)</label>
                    <input type="text" name="teaserText" defaultValue={issue.teaserText || ""} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Description (Full)</label>
                    <textarea name="description" defaultValue={issue.description || ""} rows={5} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none" />
                </div>

                <div className="pt-4">
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
