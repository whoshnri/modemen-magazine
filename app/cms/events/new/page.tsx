"use client";

import { createEvent } from "@/app/actions/cms/events";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useToast } from "@/components/toast/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploader } from "@/components/image-uploader";
// import { EventType } from "@/lib/generated/prisma/client";

const EventType = {
    FREE: "FREE",
    PAID: "PAID",
    INVITE_ONLY: "INVITE_ONLY",
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-gold-primary text-black-primary font-bold py-4 px-8 tracking-widest text-xs hover:bg-gold-secondary disabled:bg-gray-600 w-full md:w-auto"
        >
            {pending ? "CREATING..." : "CREATE EVENT"}
        </button>
    );
}

export default function NewEventPage() {
    const { showToast } = useToast();
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState("");

    async function clientAction(formData: FormData) {
        const result = await createEvent(formData);
        if (result.success) {
            showToast("Event created successfully", "success");
            router.push("/cms/events");
        } else {
            showToast(result.error || "Failed to create event", "error");
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">NEW EVENT</h2>
                <Link
                    href="/cms/events"
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
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Date & Time</label>
                            <input type="datetime-local" name="date" required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none [color-scheme:dark]" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Location</label>
                            <input type="text" name="location" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="e.g. Lagos, Nigeria" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Image URL</label>
                            <div className="space-y-3">
                                {imageUrl && (
                                    <div className="relative w-full h-40 bg-gray-900 rounded-lg overflow-hidden border border-white/10">
                                        <img src={imageUrl} alt="Event Preview" className="w-full h-full object-cover" />
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
                                        name="imageUrl"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none"
                                        placeholder="https://..."
                                    />
                                    <ImageUploader
                                        onUploadComplete={(url) => setImageUrl(url)}
                                        directory="events"
                                        trigger={
                                            <button type="button" className="px-4 bg-white/10 border border-white/10 hover:bg-white/20 transition-colors h-full flex items-center justify-center rounded-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                            </button>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Ticket Link</label>
                            <input type="url" name="ticketLink" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Event Type</label>
                            <select name="type" className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none uppercase">
                                {Object.values(EventType).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                            <input type="checkbox" name="featured" id="featured" className="w-5 h-5 accent-gold-primary bg-transparent border-white/20" />
                            <label htmlFor="featured" className="text-sm font-bold tracking-wider text-white uppercase select-none cursor-pointer">Mark as Featured Event</label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Description</label>
                    <textarea name="description" required rows={6} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none" />
                </div>

                <div className="pt-4 border-t border-white/10">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
