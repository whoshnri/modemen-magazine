import { getEvents } from "@/app/actions/cms/events";
import Link from "next/link";
import { Plus, Edit, Calendar } from "lucide-react";

export default async function EventsPage() {
    const { data: events } = await getEvents();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <h2 className="text-3xl font-bold tracking-widest text-white">EVENTS</h2>
                <Link
                    href="/cms/events/new"
                    className="flex items-center gap-2 bg-gold-primary text-black-primary px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-gold-secondary transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events?.map((event) => (
                    <div key={event.id} className="bg-[#0a0a0a] border border-white/10 group overflow-hidden flex flex-col">
                        <div className="relative h-48 bg-white/5">
                            {event.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                            )}
                            {event.featured && (
                                <div className="absolute top-2 right-2 bg-gold-primary text-black-primary text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                                    Featured
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-gold-primary font-bold uppercase tracking-widest mb-2">
                                <Calendar className="w-3 h-3" />
                                {new Date(event.date).toLocaleDateString()}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{event.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                {event.description}
                            </p>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground border border-white/20 px-2 py-1 rounded">
                                    {event.type}
                                </span>
                                <Link
                                    href={`/cms/events/${event.id}`}
                                    className="text-gold-primary hover:text-white transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
