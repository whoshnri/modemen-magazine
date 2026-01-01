"use client";

import { createIssue } from "@/app/actions/cms/issues";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useToast } from "@/components/toast/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploader } from "@/components/image-uploader";

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
    const [imageUrl, setImageUrl] = useState("");

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
                                placeholder="https://..."
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
