"use client";

import { updateInterview, deleteInterview } from "@/app/actions/cms/interviews";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";
import Link from "next/link";

export default function EditInterviewClient({ interview }: { interview: any }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { showToast } = useToast();

    async function handleUpdate(formData: FormData) {
        const result = await updateInterview(interview.id, formData);
        if (result.success) {
            showToast("Interview updated successfully", "success");
        } else {
            showToast(result.error || "Failed to update interview", "error");
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this interview?")) return;

        startTransition(async () => {
            const result = await deleteInterview(interview.id);
            if (result.success) {
                showToast("Interview deleted", "success");
                router.push("/cms/interviews");
            } else {
                showToast("Failed to delete interview", "error");
            }
        });
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">EDIT INTERVIEW</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="text-xs font-bold tracking-widest text-red-500 hover:text-red-400 transition-colors uppercase px-4"
                    >
                        {isPending ? "Deleting..." : "Delete Interview"}
                    </button>
                    <Link
                        href="/cms/interviews"
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
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Title</label>
                            <input type="text" name="title" defaultValue={interview.title} required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Slug</label>
                            <input type="text" name="slug" defaultValue={interview.slug} required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Person Interviewed</label>
                            <input type="text" name="people" defaultValue={interview.people || ""} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Tagline</label>
                            <input type="text" name="tagline" defaultValue={interview.tagline || ""} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Cover Image URL</label>
                            <input type="url" name="coverImage" defaultValue={interview.coverImage || ""} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Video URL</label>
                            <input type="url" name="videoUrl" defaultValue={interview.videoUrl || ""} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="flex items-center gap-4 pt-10">
                            <input type="checkbox" name="featured" id="featured" defaultChecked={interview.featured} className="w-5 h-5 accent-gold-primary bg-transparent border-white/20" />
                            <label htmlFor="featured" className="text-sm font-bold tracking-wider text-white uppercase select-none cursor-pointer">Mark as Featured</label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Excerpt</label>
                    <textarea name="excerpt" defaultValue={interview.excerpt || ""} rows={3} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Full Content</label>
                    <textarea name="content" defaultValue={interview.content} required rows={10} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none" />
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
