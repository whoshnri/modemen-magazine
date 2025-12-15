"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { getEvents } from "../actions/fetchEvents";
import { Event } from "@/lib/generated/prisma/client";
import Spinner from "@/components/spinner";

interface EventsContentProps {
    initialEvents: Event[];
}

export default function EventsContent({ initialEvents = [] }: EventsContentProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [loading, setLoading] = useState(initialEvents.length === 0);

    // Derive featured and others directly from the updated events state
    const featuredEvent = events.find(e => e.featured) || null;
    const otherEvents = events.filter(e => !e.featured);

    useEffect(() => {
        // If we have initial data, we don't need to fetch immediately
        if (initialEvents.length > 0) {
            setLoading(false);
            return;
        }

        async function loadEvents() {
            try {
                const data = await getEvents(0);
                if (data && Array.isArray(data)) {
                    setEvents(data);
                } else {
                    setEvents([]);
                }
            } catch (error) {
                console.error("Failed to fetch events:", error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        }

        loadEvents();
    }, [initialEvents]);

    // Simple loading state (keeps your structure intact)
    if (loading) {
        return (
            <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-5">
                    <Spinner/>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black-primary text-foreground flex flex-col">
            <Header />

            <main className="flex-1">
                <section className="relative py-32 px-6 border-b border-border overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80"
                            alt="Events Background"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-black-primary/70 z-10 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-transparent to-transparent z-10" />
                    </div>
                    <div className="relative z-20 container-responsive">
                        <h4 className="text-gold-primary tracking-[0.2em] uppercase text-xs font-bold mb-4">Experience</h4>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Events & Access</h1>
                        <p className="text-lg text-gray-200 max-w-2xl font-light leading-relaxed">
                            Curated experiences. Exclusive access. The places where the community meets.
                        </p>
                    </div>
                </section>

                {/* Featured Event */}
                {featuredEvent && (
                    <section className="py-16 bg-black-secondary border-b border-border">
                        <div className="container-responsive">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="relative aspect-video w-full overflow-hidden">
                                    <Image
                                        src={featuredEvent.imageUrl ?? ''}
                                        alt={featuredEvent?.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-gold-primary text-black-primary text-xs font-bold px-3 py-1 uppercase tracking-widest">
                                        Next Major Event
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-4 text-gold-primary mb-4 text-sm font-bold/ tracking-widest uppercase">
                                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(featuredEvent.date).toDateString()}</span>
                                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {featuredEvent.location}</span>
                                    </div>
                                    <h2 className="text-4xl text-white mb-6">{featuredEvent.title}</h2>
                                    <p className="text-muted-foreground mb-8 text-lg font-light">
                                        Join us for the most anticipated evening of the year. Black tie. Strictly by invitation or ticket purchase.
                                    </p>
                                    <Link
                                        href={`/events/${featuredEvent.slug}`}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-gold-primary text-black-primary font-bold tracking-widest uppercase hover:bg-gold-secondary hover:text-black-primary transition-colors duration-300"
                                    >
                                        <Ticket className="w-5 h-5" />
                                        {featuredEvent.type === "INVITE_ONLY" ? 'Request Invite' : 'Get Tickets'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Upcoming Events List */}
                <section className="py-16 border-b border-border">
                    <div className="container-responsive">
                        <h3 className="text-2xl font-serif text-white mb-8 border-b border-border pb-4 uppercase">Upcoming Calendar</h3>
                        <div className="space-y-6">
                            {otherEvents.map((event) => (
                                <div key={event.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 border border-border hover:border-gold-primary/50 transition-colors bg-black-secondary/20">
                                    <div className="md:col-span-3">
                                        <div className="relative aspect-video w-full h-full min-h-[120px]">
                                            <Image
                                                src={event.imageUrl ?? ''}
                                                alt={event.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-6">
                                        <div className="flex items-center gap-4 text-gold-primary mb-2 text-xs font-bold tracking-widest uppercase">
                                            <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(event.date).toDateString()}</span>
                                            {event.type === 'INVITE_ONLY' && (
                                                <span className="bg-red-900/40 text-red-200 px-2 py-0.5 border border-red-900/50 text-[10px]">Invite Only</span>
                                            )}
                                        </div>
                                        <h4 className="text-xl font-serif text-white mb-1">{event.title}</h4>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <MapPin className="w-3 h-3" /> {event.location}
                                        </div>
                                    </div>
                                    <div className="md:col-span-3 flex justify-end">
                                        <Link
                                            href={`/events/${event.slug}`}
                                            className={`inline-flex justify-center items-center w-full md:w-auto px-6 py-3 border text-bold tracking-widest uppercase text-xs transition-colors ${event.type === 'INVITE_ONLY' ? 'border-gold-primary/30 text-gold-primary hover:bg-gold-primary hover:text-black-primary' : 'border-white/20 text-white hover:bg-gold-primary hover:text-black-primary hover:border-gold-primary'}`}
                                        >
                                            {event.type === 'INVITE_ONLY' ? 'Request Invite' : 'View Details'}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
