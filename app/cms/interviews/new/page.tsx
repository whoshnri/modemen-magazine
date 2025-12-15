"use client";

import { createInterview } from "@/app/actions/cms/interviews";
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
            {pending ? "CREATING..." : "CREATE INTERVIEW"}
        </button>
    );
}

export default function NewInterviewPage() {
    const { showToast } = useToast();
    const router = useRouter();

    async function clientAction(formData: FormData) {
        const result = await createInterview(formData);
        if (result.success) {
            showToast("Interview created successfully", "success");
            router.push("/cms/interviews");
        } else {
            showToast(result.error || "Failed to create interview", "error");
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">NEW INTERVIEW</h2>
                <Link
                    href="/cms/interviews"
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
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Title</label>
                            <input type="text" name="title" required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Slug</label>
                            <input type="text" name="slug" required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Person Interviewed</label>
                            <input type="text" name="people" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="e.g. John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Tagline</label>
                            <input type="text" name="tagline" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="Brief quote or role" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Cover Image URL</label>
                            <input type="url" name="coverImage" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Video URL</label>
                            <input type="url" name="videoUrl" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="YouTube/Vimeo Link" />
                        </div>
                        <div className="flex items-center gap-4 pt-10">
                            <input type="checkbox" name="featured" id="featured" className="w-5 h-5 accent-gold-primary bg-transparent border-white/20" />
                            <label htmlFor="featured" className="text-sm font-bold tracking-wider text-white uppercase select-none cursor-pointer">Mark as Featured</label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Excerpt</label>
                    <textarea name="excerpt" rows={3} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none" placeholder="Short summary..." />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Full Content</label>
                    <textarea name="content" required rows={10} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none" />
                </div>

                <div className="pt-4 border-t border-white/10">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
