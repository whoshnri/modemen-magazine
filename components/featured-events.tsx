"use client";

import { Event } from "@/lib/generated/prisma/client";
import { useState, useEffect } from "react";
import { getFeaturedEvents } from "@/app/actions/fetchEvents";
import Spinner from "./spinner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MdMap } from "react-icons/md";
import { FaRegCalendar } from "react-icons/fa";

const PAGE_SIZE = 9;

function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadEvents = async (currentOffset: number, isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await getFeaturedEvents(currentOffset);

      if (response && response.length > 0) {
        if (isLoadMore) {
          setEvents((prev) => [...prev, ...response]);
        } else {
          setEvents(response);
        }
        setOffset(currentOffset + response.length);
        setHasMore(response.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadEvents(0, false);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadEvents(offset, true);
    }
  };

  if (loading) {
    return (
      <section className="py-20 flex justify-center">
        <Spinner />
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center">
        <p className="text-xl text-red-600">Error loading events. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 border-t bg-black-secondary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-12 md:mb-16 text-left uppercase tracking-wider text-white"
        >
          Featured Events
        </motion.h2>

        <div className="space-y-16 md:space-y-24">
          <AnimatePresence mode="popLayout">
            {events.map((event, index) => (
              <motion.article
                key={event.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="group overflow-hidden border border-border transition-colors duration-300"
              >
                <div
                  className="flex flex-col md:flex-row h-full"
                  style={{ flexDirection: index % 2 === 1 ? "row-reverse" : "row" }}
                >
                  {/* Image Section */}
                  <div className="relative w-full md:w-1/2 h-96 md:h-auto">
                    <Image
                      src={event.imageUrl ?? "/placeholder-event.jpg"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 transition-transform bg-gradient-to-t group-hover:scale-105 from-black/70 via-transparent to-transparent duration-1000" />
                  </div>

                  {/* Text Section */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 text-white">
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 transition-colors duration-500">
                      {event.title}
                    </h3>

                    <div className="flex flex-col gap-6 text-lg mb-8 text-gray-300">
                      <div className="flex items-center gap-3">
                        <MdMap/>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaRegCalendar/>
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed mb-10 line-clamp-4">
                      {event.description}
                    </p>

                    <Link href={`/events/${event.slug}`} className="inline-block px-8 py-2 border border-white text-white font-bold hover:border-gold-primary hover:bg-gold-primary hover:text-black transition-all duration-300 w-fit text-lg">
                      See Details
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
       
          <div className="mt-20 text-center">
            <Link
              href="/events"
              className="uppercase border border-white px-6 py-3 text-white hover:text-black hover:bg-white transition-colors text-xs font-bold uppercase tracking-widest mt-6 md:mt-0 duration-300 cursor-pointer"
            >
              See all events
            </Link>
          </div>
      </div>
    </section>
  );
}

export default FeaturedEvents;