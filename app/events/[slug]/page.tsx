
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Ticket, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getMoreEvents } from "@/app/actions/fetchEvents";
import { getEvent } from "@/app/actions/fetchEvents";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const event = await getEvent(slug)

    if (!event) {
        return {
            title: 'Event Not Found',
        }
    }

    return {
        title: `${event.title} | Mode Men Magazine Events`,
        description: event.description || `Join us at ${event.title}.`,
        openGraph: {
            images: [event.imageUrl || ''],
        },
    }
}

export default async function EventDetailsPage({ params }: Props) {
    const { slug } = await params;
    const event = await getEvent(slug);

    if (!event) {
        notFound();
    }

    const moreEvents = await getMoreEvents(0, slug);

    return (
        <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative h-[60vh] w-full">
                    <Image
                        src={event.imageUrl ?? ""}
                        alt={event.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                        <div className="container-responsive">
                            <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
                                {event.type === "INVITE_ONLY" && (
                                    <span className="inline-block px-4 py-2 bg-red-900/80 border border-red-500/30 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                                        Invite Only Event
                                    </span>
                                )}
                                <h1 className="text-4xl md:text-6xl/tight text-white mb-6">
                                    {event.title}
                                </h1>
                                <div className="flex flex-wrap gap-6 text-sm md:text-base font-bold tracking-widest uppercase text-gold-primary">
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" /> {new Date(event.date).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5" /> {event.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <section className="py-16 md:py-24">
                    <div className="container-responsive grid grid-cols-1 md:grid-cols-12 gap-12 ">
                        {/* Main Content */}
                        <div className="md:col-span-7 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold tracking-widest text-white mb-4 uppercase">About The Event</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed font-light">
                                    {event.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-border pt-8">
                                <div>
                                    <h4 className="text-sm text-gold-primary font-bold tracking-widest uppercase mb-2">Time</h4>
                                    <p className="text-white text-lg">{new Date(event.date).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Actions */}
                        <div className="md:col-span-5 md:pl-12">
                            <div className="bg-black-secondary border border-border p-8 sticky top-32">
                                <h3 className="text-2xl text-white mb-6">Event Access</h3>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center py-4 border-b border-white/10">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className={`font-bold uppercase tracking-widest ${event.type === "INVITE_ONLY" ? 'text-red-400' : 'text-green-400'}`}>
                                            {event.type === "INVITE_ONLY" ? 'Restricted' : 'Available'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-white/10">
                                        <span className="text-muted-foreground">Price</span>
                                        <span className="text-2xl font-bold text-white">
                                            {event.price && event.price > 0 ? `₦${event.price.toLocaleString()}` : 'Free'}
                                        </span>
                                    </div>

                                    {event.type === "INVITE_ONLY" ? (
                                        <div className="space-y-4 pt-4">
                                            <div className="flex gap-3 text-red-300 bg-red-900/20 p-4 border border-red-900/50 text-sm">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                <p>This event is strictly by invitation. Only confirmed members on the guest list will be admitted.</p>
                                            </div>
                                            <button className="w-full py-4 bg-gold-primary text-black-primary font-bold uppercase tracking-widest hover:bg-white transition-colors">
                                                Request Invitation
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 pt-4">
                                            <button className="w-full py-4 bg-gold-primary text-black-primary font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2">
                                                <Ticket className="w-5 h-5" />
                                                Purchase Ticket
                                            </button>
                                            <p className="text-center text-xs text-muted-foreground">
                                                Secure payment via Paystack. Tickets are non-refundable.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* See More Events */}
                {/* Replaced motion.section with standard section and CSS classes if needed, or just static */}
                {moreEvents && moreEvents.length > 0 && (
                    <section className="py-16 border-t border-border bg-black-secondary/30">
                        <div className="container-responsive">
                            <div className="flex justify-between items-end mb-8">
                                <h3 className="text-2xl text-white">More Events</h3>
                                <Link href="/events" className="text-sm text-white transition-colors font-bold uppercase tracking-widest border p-3 border-white hover:bg-gold-primary hover:border-gold-primary hover:text-black hidden sm:block">
                                    View All Events
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {moreEvents.map((similarEvent) => (
                                    <Link key={similarEvent.id} href={`/events/${similarEvent.slug}`} className="group block h-full border border-border hover:border-gold-primary/50 transition-colors bg-black-primary">
                                        <div className="relative aspect-video w-full overflow-hidden">
                                            <Image
                                                src={similarEvent.imageUrl ?? ''}
                                                alt={similarEvent.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {similarEvent.type === "INVITE_ONLY" && (
                                                <div className="absolute top-3 left-3 bg-red-900/90 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-red-500/30">
                                                    Invite Only
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 text-gold-primary mb-3 text-[10px] font-bold tracking-widest uppercase">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(similarEvent.date).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="text-lg text-white mb-4 group-hover:text-gold-primary transition-colors line-clamp-2">{similarEvent.title}</h4>
                                            <div className="flex items-center gap-2 text-muted-foreground text-xs mt-auto">
                                                <MapPin className="w-3 h-3" /> {similarEvent.location}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center mt-8 sm:hidden">
                            <Link href="/events" className="text-sm text-white transition-colors font-bold uppercase tracking-widest border p-3 border-white hover:bg-gold-primary hover:border-gold-primary hover:text-black ">
                                View All Events
                            </Link>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
