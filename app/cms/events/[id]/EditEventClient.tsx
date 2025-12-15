"use client";

import { updateEvent, deleteEvent } from "@/app/actions/cms/events";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useToast } from "@/components/toast/use-toast";
import Link from "next/link";

const EVENT_TYPES = ["FREE", "PAID", "INVITE_ONLY"];

export default function EditEventClient({ event }: { event: any }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { showToast } = useToast();

    async function handleUpdate(formData: FormData) {
        const result = await updateEvent(event.id, formData);
        if (result.success) {
            showToast("Event updated successfully", "success");
        } else {
            showToast(result.error || "Failed to update event", "error");
        }
    }

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this event?")) return;

        startTransition(async () => {
            const result = await deleteEvent(event.id);
            if (result.success) {
                showToast("Event deleted", "success");
                router.push("/cms/events");
            } else {
                showToast("Failed to delete event", "error");
            }
        });
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">EDIT EVENT</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="text-xs font-bold tracking-widest text-red-500 hover:text-red-400 transition-colors uppercase px-4"
                    >
                        {isPending ? "Deleting..." : "Delete Event"}
                    </button>
                    <Link
                        href="/cms/events"
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
                            <input type="text" name="title" defaultValue={event.title} required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Slug</label>
                            <input type="text" name="slug" defaultValue={event.slug} required className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Date & Time</label>
                            <input
                                type="datetime-local"
                                name="date"
                                defaultValue={new Date(event.date).toISOString().slice(0, 16)}
                                required
                                className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Location</label>
                            <input type="text" name="location" defaultValue={event.location || ""} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Image URL</label>
                            <input type="url" name="imageUrl" defaultValue={event.imageUrl || ""} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Ticket Link</label>
                            <input type="url" name="ticketLink" defaultValue={event.ticketLink || ""} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Event Type</label>
                            <select name="type" defaultValue={event.type} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none uppercase">
                                {EVENT_TYPES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                            <input type="checkbox" name="featured" id="featured" defaultChecked={event.featured} className="w-5 h-5 accent-gold-primary bg-transparent border-white/20" />
                            <label htmlFor="featured" className="text-sm font-bold tracking-wider text-white uppercase select-none cursor-pointer">Mark as Featured Event</label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gold-primary uppercase">Description</label>
                    <textarea name="description" defaultValue={event.description} required rows={6} className="w-full bg-[#050505] border border-white/10 p-4 text-white focus:border-gold-primary outline-none resize-none" />
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
